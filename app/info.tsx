import { router } from 'expo-router';
import { Globe, Info, Mail, Shield, User } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { AppCard, BackHeader, InfoRow, Screen, spacing } from '@/src/ui';

export default function InfoScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const user = useAuthStore((state) => state.user);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const userDisplayName = user?.username?.trim() || 'F Calories User';
  const userEmailAddress = user?.email?.trim() || 'No email shared';
  const userIdFormatted = user?.user_id ? `${user.user_id.substring(0, 16)}...` : 'N/A';

  return (
    <Screen palette={palette}>
      <BackHeader palette={palette} title={locale.infoPage.title} onBack={() => router.back()} />

      <AppCard palette={palette} style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: palette.accentSoft, borderColor: palette.border }]}>
          <User size={36} color={palette.accent} />
        </View>
        <View style={styles.profileText}>
          <Text style={[styles.profileName, { color: palette.text }]}>{userDisplayName}</Text>
          <Text style={[styles.profileEmail, { color: palette.subText }]}>{userEmailAddress}</Text>
        </View>
      </AppCard>

      <View style={styles.rows}>
        <InfoRow palette={palette} icon={User} label={locale.infoPage.fullName} value={userDisplayName} />
        <InfoRow palette={palette} icon={Mail} label={locale.infoPage.email} value={userEmailAddress} />
        <InfoRow palette={palette} icon={Shield} label={locale.infoPage.appleID} value={userIdFormatted} />
        <InfoRow palette={palette} icon={Globe} label={locale.infoPage.region} value={selectedCountry.toUpperCase()} />
        <InfoRow palette={palette} icon={Info} label={locale.infoPage.appVersion} value="1.0.0 (Build 1)" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 14,
  },
  rows: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
