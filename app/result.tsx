import { useLocalSearchParams, router } from 'expo-router';
import { CheckCircle2, Flame, HeartPulse, Leaf, Rewind, Droplet, Sprout, AlertCircle, X, ArrowLeft, Star } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Image, Modal } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { AppCard, InfoRow, Screen, ScreenHeader, spacing } from '@/src/ui';
import { getScan } from '../src/apis/scan';
import type { Scan } from '../src/interfaces/scan';

export default function ResultScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const [loading, setLoading] = useState(true);
  const [scan, setScan] = useState<Scan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fullscreenImageUri, setFullscreenImageUri] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bug fix: useCallback để stopPolling stable, tránh stale closure trong effects
  const stopPolling = useCallback(() => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }, []);

  // Initial fetch
  // Bug fix: nếu scan vẫn pending (race condition với SSE), polling sẽ tự retry sau 3s
  useEffect(() => {
    if (!id) {
      setErrorMsg(locale.alerts?.scanIdNotFound ?? 'Scan ID not found');
      setLoading(false);
      return;
    }

    void getScan(id).then((res) => {
      if (res.success && res.data?.data) {
        setScan(res.data.data);
      } else {
        setErrorMsg((res.error ?? locale.alerts?.loadAnalysisFailed) ?? 'Failed to load analysis');
      }
      setLoading(false);
    });
  }, [id]);

  // Polling fallback: nếu scan vẫn pending (SSE mất kết nối hoặc race condition)
  useEffect(() => {
    if (!scan || scan.status !== 'pending' || !id) return;

    pollingRef.current = setInterval(async () => {
      const res = await getScan(id);
      if (res.success && res.data?.data && res.data.data.status !== 'pending') {
        setScan(res.data.data);
        stopPolling();
      }
    }, 3000);

    // Timeout sau 60s
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setErrorMsg(locale.processing.timeout);
    }, 60_000);

    return stopPolling;
  }, [scan?.status, id, stopPolling]);

  const macros = useMemo(() => {
    if (!scan?.analysis) return [];
    return [
      { label: locale.result.calories, value: `${scan.analysis.calories} kcal`, icon: Flame },
      { label: locale.result.protein, value: `${scan.analysis.protein} g`, icon: HeartPulse },
      { label: locale.result.carbs, value: `${scan.analysis.carbs} g`, icon: Leaf },
      { label: locale.result.fat, value: `${scan.analysis.fat} g`, icon: Droplet },
      { label: locale.result.fiber, value: `${scan.analysis.fiber} g`, icon: Sprout },
      { label: locale.result.grade, value: scan.analysis.grade, icon: Star },
    ];
  }, [scan, locale]);

  const footer = (
    <Pressable
      onPress={() => {
        if (from === 'history') {
          router.back();
        } else {
          router.replace('/scan');
        }
      }}
      style={({ pressed }) => [
        styles.scanAgain,
        { backgroundColor: palette.cardBg, borderColor: palette.border },
        pressed && styles.pressed,
      ]}
    >
      {from === 'history' ? (
        <ArrowLeft size={18} color={palette.text} />
      ) : (
        <Rewind size={18} color={palette.text} />
      )}
      <Text style={[styles.scanAgainText, { color: palette.text }]}>
        {from === 'history'
          ? (locale.result.backToHistory)
          : (locale.result.scanAnother)}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <Screen palette={palette} footer={footer}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.accent} />
          <Text style={[styles.loadingText, { color: palette.subText }]}>
            {locale.alerts?.loadingAnalysis ?? 'Loading...'}
          </Text>
        </View>
      </Screen>
    );
  }

  if (errorMsg || !scan) {
    return (
      <Screen palette={palette} footer={footer}>
        <View style={styles.centerContainer}>
          <AlertCircle size={40} color="#f87171" />
          <Text style={[styles.errorText, { color: palette.text }]}>{errorMsg || 'Error'}</Text>
        </View>
      </Screen>
    );
  }

  // Guard: scan vẫn pending (vào từ history khi chưa xong)
  if (scan.status === 'pending' || !scan.analysis) {
    return (
      <Screen palette={palette} footer={footer}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.accent} />
          <Text style={[styles.loadingText, { color: palette.subText }]}>
            {locale.processing.title}
          </Text>
          <Text style={[styles.loadingText, { color: palette.subText, fontSize: 13 }]}>
            {locale.processing.pleaseWait}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen palette={palette} footer={footer}>
      <View style={styles.statusRow}>
        <CheckCircle2 size={22} color={palette.accent} />
        <Text style={[styles.statusText, { color: palette.accentText }]}>
          {locale.result.scanComplete}
        </Text>
      </View>

      <ScreenHeader
        palette={palette}
        title={locale.result.title}
        description={locale.result.description}
      />

      {scan.image_urls && scan.image_urls.length > 0 && (
        <Pressable onPress={() => setFullscreenImageUri(scan.image_urls[0])}>
          <Image source={{ uri: scan.image_urls[0] }} style={styles.mealImage} resizeMode="cover" />
        </Pressable>
      )}

      <AppCard palette={palette} style={styles.mealCard}>
        <Text style={[styles.mealTitle, { color: palette.text }]}>{scan.analysis.meal_name}</Text>
        <Text style={[styles.mealDesc, { color: palette.subText }]}>
          {scan.analysis.description}
        </Text>
        <View style={styles.macros}>
          {macros.map((item) => (
            <InfoRow key={item.label} palette={palette} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>
      </AppCard>

      {/* Suggestions */}
      {scan.analysis.suggestions && scan.analysis.suggestions.length > 0 && (
        <AppCard palette={palette} style={styles.mealCard}>
          <Text style={[styles.mealTitle, { color: palette.text }]}>
            {locale.result.suggestions}
          </Text>
          <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
            {scan.analysis.suggestions.map((s, i) => (
              <Text key={i} style={[styles.suggestionItem, { color: palette.subText }]}>
                {'• '}{s}
              </Text>
            ))}
          </View>
        </AppCard>
      )}

      <Modal
        visible={!!fullscreenImageUri}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenImageUri(null)}
      >
        <View style={styles.fullscreenContainer}>
          <Pressable onPress={() => setFullscreenImageUri(null)} style={styles.fullscreenCloseButton}>
            <X size={24} color="#fff" />
          </Pressable>
          {fullscreenImageUri && (
            <Image source={{ uri: fullscreenImageUri }} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mealImage: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    marginBottom: spacing.md,
  },
  mealCard: {
    marginBottom: spacing.md,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  mealDesc: {
    marginTop: spacing.xs,
    fontSize: 14,
    lineHeight: 20,
  },
  macros: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  suggestionItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  scanAgain: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    right: 24,
    top: 64,
    zIndex: 10,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
