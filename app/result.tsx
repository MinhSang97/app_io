import { Link } from 'expo-router';
import { CheckCircle2, Flame, HeartPulse, Leaf, Rewind } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useMemo } from 'react';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';

export default function ResultScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const locale = getLocale(selectedCountry);

  const macros = useMemo(() => [
    { label: locale.result.calories, value: '542 kcal', icon: Flame },
    { label: locale.result.protein, value: '38 g', icon: HeartPulse },
    { label: locale.result.carbs, value: '41 g', icon: Leaf },
  ], [locale]);

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-16">
      <View className="flex-row items-center gap-3">
        <CheckCircle2 size={24} color="#34d399" />
        <Text className="text-emerald-400 font-semibold">{locale.result.scanComplete}</Text>
      </View>

      <Text className="mt-3 text-4xl font-bold text-white">{locale.result.title}</Text>
      <Text className="mt-3 text-base leading-6 text-zinc-400">
        {locale.result.description}
      </Text>

      <View className="mt-8 rounded-[32px] bg-white/5 p-5">
        <Text className="text-lg font-semibold text-white">Grilled chicken bowl</Text>
        <Text className="mt-1 text-zinc-400">Chicken, rice, avocado, mixed greens, and sesame dressing</Text>

        <View className="mt-6 gap-3">
          {macros.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.label} className="flex-row items-center justify-between rounded-2xl bg-zinc-900 px-4 py-4">
                <View className="flex-row items-center gap-3">
                  <Icon size={18} color="#a3a3a3" />
                  <Text className="text-zinc-300">{item.label}</Text>
                </View>
                <Text className="text-white font-semibold">{item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className="mt-6 rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-5">
        <Text className="text-emerald-300 font-semibold">{locale.result.aiInsight}</Text>
        <Text className="mt-2 leading-6 text-zinc-300">
          Great balance of protein and fiber. Consider reducing dressing slightly if you want a lower calorie meal.
        </Text>
      </View>

      <View className="mt-auto gap-3 pb-10">
        <Link href="/scan" asChild>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 py-4">
            <Rewind size={18} color="#fff" />
            <Text className="text-white font-semibold">{locale.result.scanAnother}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
