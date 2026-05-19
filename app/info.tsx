import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Shield, Globe, Info } from 'lucide-react-native';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';

export default function InfoScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const appleFullName = useAuthStore((state) => state.appleFullName);
  const appleEmail = useAuthStore((state) => state.appleEmail);
  const appleUserId = useAuthStore((state) => state.appleUserId);
  const locale = getLocale(selectedCountry);

  const userDisplayName = appleFullName || 'ÍO User';
  const userEmailAddress = appleEmail || 'No email shared';
  const userAppleIdFormatted = appleUserId 
    ? `${appleUserId.substring(0, 16)}...` 
    : 'N/A';

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-16">
      {/* Header row with back button */}
      <View className="flex-row items-center gap-4 mb-8">
        <Pressable 
          onPress={() => router.back()} 
          className="rounded-full bg-white/5 p-3 border border-white/10 active:bg-white/10"
        >
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text className="text-2xl font-bold text-white">{locale.infoPage.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Card Header */}
        <View className="items-center mb-8 bg-white/5 rounded-[28px] p-6 border border-white/10">
          <View className="w-20 h-20 rounded-full bg-emerald-400/10 items-center justify-center mb-4 border border-emerald-400/20">
            <User size={40} color="#34d399" />
          </View>
          <Text className="text-xl font-bold text-white">{userDisplayName}</Text>
          <Text className="text-sm text-zinc-500 mt-1">{userEmailAddress}</Text>
        </View>

        {/* Info Rows */}
        <View className="gap-4 mb-10">
          {/* Full Name Row */}
          <View className="flex-row items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl border border-white/5">
            <View className="rounded-xl bg-zinc-800 p-2.5">
              <User size={18} color="#a1a1aa" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-zinc-500">{locale.infoPage.fullName}</Text>
              <Text className="text-base font-semibold text-white mt-0.5">{userDisplayName}</Text>
            </View>
          </View>

          {/* Email Row */}
          <View className="flex-row items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl border border-white/5">
            <View className="rounded-xl bg-zinc-800 p-2.5">
              <Mail size={18} color="#a1a1aa" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-zinc-500">{locale.infoPage.email}</Text>
              <Text className="text-base font-semibold text-white mt-0.5" numberOfLines={1}>{userEmailAddress}</Text>
            </View>
          </View>

          {/* Apple ID Row */}
          <View className="flex-row items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl border border-white/5">
            <View className="rounded-xl bg-zinc-800 p-2.5">
              <Shield size={18} color="#a1a1aa" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-zinc-500">{locale.infoPage.appleId}</Text>
              <Text className="text-base font-semibold text-white mt-0.5">{userAppleIdFormatted}</Text>
            </View>
          </View>

          {/* Country / Region Row */}
          <View className="flex-row items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl border border-white/5">
            <View className="rounded-xl bg-zinc-800 p-2.5">
              <Globe size={18} color="#a1a1aa" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-zinc-500">{locale.infoPage.region}</Text>
              <Text className="text-base font-semibold text-white mt-0.5">
                {selectedCountry.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* App Version Row */}
          <View className="flex-row items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl border border-white/5">
            <View className="rounded-xl bg-zinc-800 p-2.5">
              <Info size={18} color="#a1a1aa" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-zinc-500">{locale.infoPage.appVersion}</Text>
              <Text className="text-base font-semibold text-white mt-0.5">1.0.0 (Build 1)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
