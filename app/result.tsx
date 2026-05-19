import { Link } from 'expo-router';
import { CheckCircle2, Flame, HeartPulse, Leaf, Rewind } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useMemo } from 'react';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/useAppTheme';

export default function ResultScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const { colors, isDark } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const macros = useMemo(() => [
    { label: locale.result.calories, value: '542 kcal', icon: Flame },
    { label: locale.result.protein, value: '38 g', icon: HeartPulse },
    { label: locale.result.carbs, value: '41 g', icon: Leaf },
  ], [locale]);

  return (
    <View className={`flex-1 px-6 pt-16 ${colors.bg}`}>
      <View className="flex-row items-center gap-3">
        <CheckCircle2 size={24} color={isDark ? '#34d399' : '#059669'} />
        <Text className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{locale.result.scanComplete}</Text>
      </View>

      <Text className={`mt-3 text-4xl font-bold ${colors.text}`}>{locale.result.title}</Text>
      <Text className={`mt-3 text-base leading-6 ${colors.subText}`}>
        {locale.result.description}
      </Text>

      <View className={`mt-8 rounded-[32px] p-5 ${colors.card}`}>
        <Text className={`text-lg font-semibold ${colors.text}`}>Grilled chicken bowl</Text>
        <Text className={`mt-1 ${colors.subText}`}>Chicken, rice, avocado, mixed greens, and sesame dressing</Text>

        <View className="mt-6 gap-3">
          {macros.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.label} className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${colors.rowBg}`}>
                <View className="flex-row items-center gap-3">
                  <Icon size={18} color={isDark ? '#a3a3a3' : '#4b5563'} />
                  <Text className={colors.text}>{item.label}</Text>
                </View>
                <Text className={`font-semibold ${colors.text}`}>{item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={`mt-6 rounded-[28px] border p-5 ${isDark ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-emerald-500/25 bg-emerald-500/5'}`}>
        <Text className={`font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{locale.result.aiInsight}</Text>
        <Text className={`mt-2 leading-6 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
          Great balance of protein and fiber. Consider reducing dressing slightly if you want a lower calorie meal.
        </Text>
      </View>

      <View className="mt-auto gap-3 pb-10">
        <Link href="/scan" asChild>
          <Pressable className={`flex-row items-center justify-center gap-2 rounded-3xl border py-4 ${colors.closeButtonBg} ${colors.border}`}>
            <Rewind size={18} color={isDark ? '#fff' : '#000'} />
            <Text className={`font-semibold ${colors.text}`}>{locale.result.scanAnother}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
