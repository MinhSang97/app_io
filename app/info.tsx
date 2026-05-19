import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Shield, Globe, Info } from 'lucide-react-native';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/useAppTheme';

export default function InfoScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const appleFullName = useAuthStore((state) => state.appleFullName);
  const appleEmail = useAuthStore((state) => state.appleEmail);
  const appleUserId = useAuthStore((state) => state.appleUserId);
  const { colors, isDark } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const userDisplayName = appleFullName || 'ÍO User';
  const userEmailAddress = appleEmail || 'No email shared';
  const userAppleIdFormatted = appleUserId 
    ? `${appleUserId.substring(0, 16)}...` 
    : 'N/A';

  return (
    <View className={`flex-1 px-6 pt-16 ${colors.bg}`}>
      {/* Header row with back button */}
      <View className="flex-row items-center gap-4 mb-8">
        <Pressable 
          onPress={() => router.back()} 
          className={`rounded-full p-3 border active:opacity-75 ${colors.closeButtonBg} ${colors.border}`}
        >
          <ArrowLeft size={20} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text className={`text-2xl font-bold ${colors.text}`}>{locale.infoPage.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* User Card Header */}
        <View className={`items-center mb-8 rounded-[28px] p-6 border ${colors.card}`}>
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 border ${colors.emeraldBg}`}>
            <User size={40} color={isDark ? '#34d399' : '#059669'} />
          </View>
          <Text className={`text-xl font-bold ${colors.text}`}>{userDisplayName}</Text>
          <Text className={`text-sm mt-1 ${colors.subText}`}>{userEmailAddress}</Text>
        </View>

        {/* Info Rows */}
        <View className="gap-4 mb-10">
          {/* Full Name Row */}
          <View className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}>
            <View className={`rounded-xl p-2.5 ${colors.iconContainer}`}>
              <User size={18} color={colors.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${colors.subText}`}>{locale.infoPage.fullName}</Text>
              <Text className={`text-base font-semibold mt-0.5 ${colors.text}`}>{userDisplayName}</Text>
            </View>
          </View>

          {/* Email Row */}
          <View className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}>
            <View className={`rounded-xl p-2.5 ${colors.iconContainer}`}>
              <Mail size={18} color={colors.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${colors.subText}`}>{locale.infoPage.email}</Text>
              <Text className={`text-base font-semibold mt-0.5 ${colors.text}`} numberOfLines={1}>{userEmailAddress}</Text>
            </View>
          </View>

          {/* Apple ID Row */}
          <View className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}>
            <View className={`rounded-xl p-2.5 ${colors.iconContainer}`}>
              <Shield size={18} color={colors.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${colors.subText}`}>{locale.infoPage.appleId}</Text>
              <Text className={`text-base font-semibold mt-0.5 ${colors.text}`}>{userAppleIdFormatted}</Text>
            </View>
          </View>

          {/* Country / Region Row */}
          <View className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}>
            <View className={`rounded-xl p-2.5 ${colors.iconContainer}`}>
              <Globe size={18} color={colors.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${colors.subText}`}>{locale.infoPage.region}</Text>
              <Text className={`text-base font-semibold mt-0.5 ${colors.text}`}>
                {selectedCountry.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* App Version Row */}
          <View className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}>
            <View className={`rounded-xl p-2.5 ${colors.iconContainer}`}>
              <Info size={18} color={colors.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-xs ${colors.subText}`}>{locale.infoPage.appVersion}</Text>
              <Text className={`text-base font-semibold mt-0.5 ${colors.text}`}>1.0.0 (Build 1)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
