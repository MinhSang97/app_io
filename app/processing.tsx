import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { Screen } from '@/src/ui';
import { useScanSSE } from '../src/hooks/use-scan-sse';

export default function ProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const locale = getLocale(selectedCountry);
  const { palette, isDark } = useAppTheme();

  const { progress, result, error } = useScanSSE(id ?? null);

  // Bug fix: dùng useCallback để failed string stable, tránh deps thay đổi liên tục
  const failedLabel = locale.processing.failed;
  const retryLabel = locale.processing.retry;

  // Khi SSE trả về result → navigate sang result
  useEffect(() => {
    if (result) {
      router.replace({ pathname: '/result', params: { id } });
    }
  }, [result, id]);

  // Bug fix: chỉ depend vào error, không depend vào locale (locale là obj mới mỗi render)
  const handleError = useCallback((msg: string) => {
    Alert.alert(failedLabel, msg, [
      { text: retryLabel, onPress: () => router.replace('/scan') },
    ]);
  }, [failedLabel, retryLabel]);

  useEffect(() => {
    if (error) handleError(error);
  }, [error, handleError]);

  // Bug fix: chặn back button Android để tránh user thoát giữa chừng
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const percent = progress?.percent ?? 0;
  const statusText = progress?.status ?? (locale.processing.title);
  const messageText = progress?.message ?? (locale.processing.pleaseWait);

  const trackColor = isDark ? '#27272a' : '#e4e4e7';
  const fillColor = isDark ? '#34d399' : '#059669';

  return (
    <Screen palette={palette}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🍜</Text>
        <Text style={[styles.title, { color: palette.text }]}>{statusText}</Text>
        <Text style={[styles.message, { color: palette.subText }]}>{messageText}</Text>

        <View style={[styles.track, { backgroundColor: trackColor }]}>
          <View
            style={[
              styles.fill,
              { width: `${percent}%` as any, backgroundColor: fillColor },
            ]}
          />
        </View>

        <Text style={[styles.percent, { color: palette.subText }]}>{percent}%</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 99,
    marginTop: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
  percent: {
    fontSize: 13,
    fontWeight: '600',
  },
});
