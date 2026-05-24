import { Link } from 'expo-router';
import { CheckCircle2, Flame, HeartPulse, Leaf, Rewind } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { AppCard, InfoRow, Screen, ScreenHeader, spacing } from '@/src/ui';

export default function ResultScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const macros = useMemo(
    () => [
      { label: locale.result.calories, value: '542 kcal', icon: Flame },
      { label: locale.result.protein, value: '38 g', icon: HeartPulse },
      { label: locale.result.carbs, value: '41 g', icon: Leaf },
    ],
    [locale],
  );

  return (
    <Screen palette={palette} footer={
      <Link href="/scan" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.scanAgain,
            { backgroundColor: palette.cardBg, borderColor: palette.border },
            pressed && styles.pressed,
          ]}
        >
          <Rewind size={18} color={palette.text} />
          <Text style={[styles.scanAgainText, { color: palette.text }]}>{locale.result.scanAnother}</Text>
        </Pressable>
      </Link>
    }>
      <View style={styles.statusRow}>
        <CheckCircle2 size={22} color={palette.accent} />
        <Text style={[styles.statusText, { color: palette.accentText }]}>{locale.result.scanComplete}</Text>
      </View>

      <ScreenHeader palette={palette} title={locale.result.title} description={locale.result.description} />

      <AppCard palette={palette} style={styles.mealCard}>
        <Text style={[styles.mealTitle, { color: palette.text }]}>Grilled chicken bowl</Text>
        <Text style={[styles.mealDesc, { color: palette.subText }]}>
          Chicken, rice, avocado, mixed greens, and sesame dressing
        </Text>
        <View style={styles.macros}>
          {macros.map((item) => (
            <InfoRow key={item.label} palette={palette} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </View>
      </AppCard>

      <AppCard palette={palette} style={[styles.insightCard, { backgroundColor: palette.accentSoft, borderColor: palette.border }]}>
        <Text style={[styles.insightTitle, { color: palette.accentText }]}>{locale.result.aiInsight}</Text>
        <Text style={[styles.insightBody, { color: palette.text }]}>
          Great balance of protein and fiber. Consider reducing dressing slightly if you want a lower calorie meal.
        </Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  mealCard: {
    marginBottom: spacing.md,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  mealDesc: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  macros: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  insightCard: {
    marginBottom: spacing.md,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  insightBody: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
  },
  scanAgain: {
    minHeight: 50,
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
});
