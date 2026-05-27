import React, { useState } from 'react';
import { router } from 'expo-router';
import { Globe, Info, Mail, Shield, User, Award, Zap, Sparkles, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { AppCard, BackHeader, InfoRow, Screen, spacing, radius } from '@/src/ui';

export default function InfoScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const user = useAuthStore((state) => state.user);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const [vipExpanded, setVipExpanded] = useState(false);

  const isVn = selectedCountry === 'vn';

  const planNames: Record<string, Record<string, string>> = {
    basic: {
      vn: 'Cơ bản', us: 'Basic', gb: 'Basic', jp: '基本', kr: '기본', cn: '基本',
      fr: 'Basic', de: 'Basic', es: 'Básico', pt: 'Básico', id: 'Dasar', th: 'พื้นฐาน'
    },
    plus: {
      vn: 'Plus', us: 'Plus', gb: 'Plus', jp: 'プラス', kr: '플러스', cn: 'Plus',
      fr: 'Plus', de: 'Plus', es: 'Plus', pt: 'Plus', id: 'Plus', th: 'พลัส'
    },
    pro: {
      vn: 'Pro', us: 'Pro', gb: 'Pro', jp: 'プロ', kr: '프로', cn: 'Pro',
      fr: 'Pro', de: 'Pro', es: 'Pro', pt: 'Pro', id: 'Pro', th: 'โปร'
    },
    ultra: {
      vn: 'Ultra', us: 'Ultra', gb: 'Ultra', jp: 'ウルトラ', kr: '울트라', cn: 'Ultra',
      fr: 'Ultra', de: 'Ultra', es: 'Ultra', pt: 'Ultra', id: 'Ultra', th: 'อัลตรา'
    }
  };

  const getPlanDisplayName = (code?: string) => {
    const key = code || 'basic';
    return planNames[key]?.[selectedCountry] || planNames[key]?.['us'] || key;
  };

  const rankNames: Record<string, Record<string, string>> = {
    bronze: {
      vn: 'Đồng', us: 'Bronze', gb: 'Bronze', jp: 'ブロンズ', kr: '브론즈', cn: '青铜',
      fr: 'Bronze', de: 'Bronze', es: 'Bronce', pt: 'Bronze', id: 'Perunggu', th: 'ทองแดง'
    },
    silver: {
      vn: 'Bạc', us: 'Silver', gb: 'Silver', jp: 'シルバー', kr: '실버', cn: '白银',
      fr: 'Argent', de: 'Silber', es: 'Plata', pt: 'Prata', id: 'Perak', th: 'เงิน'
    },
    gold: {
      vn: 'Vàng', us: 'Gold', gb: 'Gold', jp: 'ゴールド', kr: '골드', cn: '黄金',
      fr: 'Or', de: 'Gold', es: 'Oro', pt: 'Ouro', id: 'Emas', th: 'ทอง'
    },
    platinum: {
      vn: 'Bạch Kim', us: 'Platinum', gb: 'Platinum', jp: 'プラチナ', kr: '플래티넘', cn: '白金',
      fr: 'Platine', de: 'Platin', es: 'Platino', pt: 'Platina', id: 'Platina', th: 'แพลทินัม'
    },
    diamond: {
      vn: 'Kim Cương', us: 'Diamond', gb: 'Diamond', jp: 'ダイヤモンド', kr: '다이아몬드', cn: '钻石',
      fr: 'Diamant', de: 'Diamant', es: 'Diamante', pt: 'Diamante', id: 'Berlian', th: 'เพชr'
    }
  };

  const getRankDisplayName = (rankName?: string) => {
    const key = (rankName || 'bronze').toLowerCase();
    return rankNames[key]?.[selectedCountry] || rankNames[key]?.['us'] || rankName || 'Bronze';
  };

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

      {/* Mục Gói Dịch Vụ & VIP - Có thể mở rộng/thu gọn */}
      <Pressable
        onPress={() => setVipExpanded(!vipExpanded)}
        style={({ pressed }) => [
          styles.vipHeaderRow,
          {
            backgroundColor: palette.cardBg,
            borderColor: vipExpanded ? palette.accent : palette.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.vipHeaderLeft}>
          <Award size={20} color={palette.accent} />
          <View>
            <Text style={[styles.vipHeaderTitle, { color: palette.text }]}>
              {isVn ? "Gói Dịch vụ & VIP" : "Membership & VIP"}
            </Text>
            <Text style={{ fontSize: 12, color: palette.subText, marginTop: 2 }}>
              {`${getPlanDisplayName(user?.subscription_tier)} • ⭐ ${getRankDisplayName(user?.vip_rank)} VIP`}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text style={{ fontSize: 13, color: palette.accentText, fontWeight: '700' }}>
            {vipExpanded ? (isVn ? "Thu gọn" : "Hide") : (isVn ? "Xem chi tiết" : "Details")}
          </Text>
          {vipExpanded ? (
            <ChevronUp size={16} color={palette.accent} />
          ) : (
            <ChevronDown size={16} color={palette.accent} />
          )}
        </View>
      </Pressable>

      {/* Bảng Chi Tiết VIP khi nhấn mở ra */}
      {vipExpanded && (
        <View style={[styles.vipDetailCard, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
          <View style={styles.vipDetailRow}>
            <View style={[styles.detailIcon, { backgroundColor: palette.rowBg }]}>
              <Award size={18} color={palette.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailRowLabel, { color: palette.muted }]}>
                {isVn ? "Hạng Thành Viên" : "VIP Rank"}
              </Text>
              <Text style={[styles.detailRowValue, { color: palette.text }]}>
                {`⭐ ${getRankDisplayName(user?.vip_rank)} VIP`}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.vipDetailRow}>
            <View style={[styles.detailIcon, { backgroundColor: palette.rowBg }]}>
              <Sparkles size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailRowLabel, { color: palette.muted }]}>
                {isVn ? "Gói Đang Sử Dụng" : "Active Subscription"}
              </Text>
              <Text style={[styles.detailRowValue, { color: palette.text }]}>
                {getPlanDisplayName(user?.subscription_tier)}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.vipDetailRow}>
            <View style={[styles.detailIcon, { backgroundColor: palette.rowBg }]}>
              <Zap size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailRowLabel, { color: palette.muted }]}>
                {isVn ? "Điểm VIP tích lũy" : "VIP Points"}
              </Text>
              <Text style={[styles.detailRowValue, { color: palette.text }]}>
                {isVn 
                  ? `Khả dụng: ${user?.vip_points_balance || 0} Pts (Tổng: ${user?.vip_points_earned || 0} Pts)`
                  : `Balance: ${user?.vip_points_balance || 0} Pts (Total: ${user?.vip_points_earned || 0} Pts)`}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <Pressable
            onPress={() => router.push('/paywall')}
            style={({ pressed }) => [
              styles.upgradeButton,
              { backgroundColor: palette.accentSoft },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.upgradeButtonText, { color: palette.accentText }]}>
              {isVn ? "Nâng cấp / Thay đổi gói" : "Upgrade / Change Plan"}
            </Text>
            <ChevronRight size={16} color={palette.accent} />
          </Pressable>
        </View>
      )}

      {/* Các thông tin cơ bản khác */}
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
  vipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  vipHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  vipHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  vipDetailCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  vipDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRowLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailRowValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  rows: {
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
