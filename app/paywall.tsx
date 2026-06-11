import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Check, ShieldAlert, Sparkles, Award, Zap, Heart, CheckCircle2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { BackHeader, radius, Screen, spacing, PrimaryButton } from '@/src/ui';
import { listPlans, purchaseSubscription } from '../src/apis/subscription';
import { syncUserProfileFromServer } from '../src/lib/user_profile';
import type { SubscriptionPlan } from '../src/interfaces/subscription';

const planConfigs: Record<string, { color: string; badge: string }> = {
  basic: { color: '#71717a', badge: 'BASIC' },
  plus: { color: '#3b82f6', badge: 'POPULAR' },
  pro: { color: '#8b5cf6', badge: 'RECOMMENDED' },
  ultra: { color: '#ec4899', badge: 'ULTIMATE' },
};

export default function PaywallScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const user = useAuthStore((state) => state.user);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>('pro');
  const [loading, setLoading] = useState<boolean>(false);

  const isVn = selectedCountry === 'vn';

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await listPlans();
      if (res.success && res.data?.data) {
        setPlans(res.data.data);
      } else {
        Alert.alert(
          isVn ? 'Lỗi' : 'Error',
          res.error || (isVn ? 'Không tải được danh sách gói.' : 'Failed to load plans.')
        );
      }
      setLoadingPlans(false);
    };
    fetchPlans();
  }, [isVn]);

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
      vn: 'Ultra', us: 'Ultra', gb: 'Ultra', jp: 'ウルトラ', kr: '울特拉', cn: 'Ultra',
      fr: 'Ultra', de: 'Ultra', es: 'Ultra', pt: 'Ultra', id: 'Ultra', th: 'อัลตรา'
    }
  };

  const getPlanDisplayName = (code: string, fallback: string) => {
    return planNames[code]?.[selectedCountry] || planNames[code]?.['us'] || fallback;
  };

  const getPlanColor = (code: string) => planConfigs[code]?.color || '#71717a';
  const getPlanBadge = (code: string) => planConfigs[code]?.badge || 'VIP';

  const formatHistoryLimit = (limit: number) => {
    if (limit === -1) return isVn ? 'Không giới hạn' : 'Unlimited';
    return isVn ? `${limit} ngày` : `${limit} days`;
  };

  const formatMaxScans = (max: number) => {
    return isVn ? `${max} scans/ngày` : `${max} scans/day`;
  };

  const currentPlan = plans.find((p) => p.code === selectedPlanCode) || plans[0];

  const getPlanLevel = (code?: string): number => {
    switch (code) {
      case 'ultra': return 3;
      case 'pro': return 2;
      case 'plus': return 1;
      case 'basic':
      default:
        return 0;
    }
  };

  const handlePurchase = () => {
    if (!user) {
      Alert.alert(
        isVn ? 'Lỗi' : 'Error',
        isVn ? 'Vui lòng đăng nhập để nâng cấp.' : 'Please log in to upgrade.'
      );
      return;
    }

    const userPlanLevel = getPlanLevel(user.subscription_tier);
    const selectedPlanLevel = getPlanLevel(selectedPlanCode);

    if (user.subscription_tier === selectedPlanCode) {
      Alert.alert(
        isVn ? 'Gói hiện tại' : 'Current Plan',
        isVn ? 'Bạn đang sử dụng gói này rồi.' : 'You are already subscribed to this plan.'
      );
      return;
    }

    if (userPlanLevel > selectedPlanLevel) {
      Alert.alert(
        isVn ? 'Không hỗ trợ hạ cấp' : 'Downgrade Not Supported',
        isVn
          ? 'Gói được chọn thấp hơn gói hiện tại của bạn. Vui lòng liên hệ Admin để thay đổi hạ cấp gói dịch vụ.'
          : 'The selected plan is lower than your current subscription. Please contact support/admin to downgrade your plan.'
      );
      return;
    }

    const isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.role === 'super_admin';
    if (!isAdmin) {
      Alert.alert(
        isVn ? 'Không có quyền' : 'Access Denied',
        isVn
          ? 'Tài khoản thường không thể thực hiện mock purchase. Vui lòng liên hệ Admin để được nâng cấp.'
          : 'Standard accounts cannot perform mock purchases. Please contact Admin to upgrade.'
      );
      return;
    }

    setLoading(true);

    void purchaseSubscription({
      plan_code: selectedPlanCode,
      payment_provider: 1, // Mock
      payment_id: `tx_mock_${Date.now()}`,
    }).then(async (res) => {
      if (res.success && res.data?.data) {
        // Sync user profile from server
        await syncUserProfileFromServer({ force: true });
        setLoading(false);

        const planInfo = plans.find((p) => p.code === selectedPlanCode);
        const localizedName = planInfo ? getPlanDisplayName(planInfo.code, planInfo.name) : selectedPlanCode;

        Alert.alert(
          isVn ? 'Thành công (API Mock)' : 'Success (API Mock)',
          isVn
            ? `Nâng cấp thành công lên gói ${localizedName}!\nBạn được cộng +${planInfo?.vip_points_reward || 0} điểm VIP.\n(Đã đồng bộ lên server)`
            : `Successfully upgraded to ${localizedName} plan!\nYou received +${planInfo?.vip_points_reward || 0} VIP points.\n(Synced to server)`
        );
        router.back();
      } else {
        setLoading(false);
        Alert.alert(
          isVn ? 'Lỗi' : 'Error',
          res.error || (isVn ? 'Thanh toán thất bại.' : 'Payment failed.')
        );
      }
    }).catch((err) => {
      setLoading(false);
      Alert.alert(
        isVn ? 'Lỗi' : 'Error',
        isVn ? 'Đã có lỗi xảy ra kết nối đến máy chủ.' : 'An error occurred while connecting to server.'
      );
    });
  };

  if (loadingPlans) {
    return (
      <Screen palette={palette}>
        <BackHeader
          palette={palette}
          title={isVn ? 'Thành viên VIP' : 'VIP Subscription'}
          onBack={() => router.back()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen palette={palette} scrollable={true}>
      <BackHeader
        palette={palette}
        title={isVn ? 'Thành viên VIP' : 'VIP Subscription'}
        onBack={() => router.back()}
      />

      <View style={styles.headerContainer}>
        <Sparkles size={32} color={palette.accent} style={styles.sparkleIcon} />
        <Text style={[styles.title, { color: palette.text }]}>
          {isVn ? 'Nâng cấp Gói F Calories' : 'Upgrade F Calories'}
        </Text>
        <Text style={[styles.subtitle, { color: palette.subText }]}>
          {isVn
            ? 'Mở khóa phân tích AI chuyên sâu, đồng bộ dữ liệu và nhận đặc quyền VIP đặc biệt.'
            : 'Unlock in-depth AI analysis, data synchronization, and exclusive VIP status.'}
        </Text>
      </View>

      {/* Danh sách gói dạng Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansScroll}
      >
        {plans.map((plan) => {
          const isSelected = selectedPlanCode === plan.code;
          const isUserPlan = user?.subscription_tier === plan.code || (!user?.subscription_tier && plan.code === 'basic');
          const planColor = getPlanColor(plan.code);
          const planBadge = getPlanBadge(plan.code);
          const displayPrice = plan.price === 0
            ? (isVn ? 'Miễn phí' : 'Free')
            : `$${plan.price}`;

          return (
            <Pressable
              key={plan.code}
              onPress={() => setSelectedPlanCode(plan.code)}
              style={[
                styles.planCard,
                {
                  backgroundColor: palette.cardBg,
                  borderColor: isSelected ? planColor : palette.border,
                  borderWidth: isSelected ? 2 : 1,
                  shadowColor: palette.shadow,
                },
              ]}
            >
              <View style={[styles.planBadgeContainer, { backgroundColor: isSelected ? planColor : 'transparent' }]}>
                <Text style={[styles.planBadgeText, { color: isSelected ? '#ffffff' : palette.muted }]}>
                  {planBadge}
                </Text>
              </View>

              <Text style={[styles.planName, { color: palette.text }]}>
                {getPlanDisplayName(plan.code, plan.name)}
              </Text>
              
              <Text style={[styles.planPrice, { color: planColor }]}>{displayPrice}</Text>
              <Text style={[styles.planPeriod, { color: palette.muted }]}>
                {plan.code === 'basic' ? '' : (isVn ? '/tháng' : '/month')}
              </Text>

              {plan.vip_points_reward > 0 && (
                <View style={[styles.pointBadge, { backgroundColor: palette.accentSoft }]}>
                  <Award size={13} color={palette.accent} />
                  <Text style={[styles.pointBadgeText, { color: palette.accentText }]}>
                    +{plan.vip_points_reward} VIP Pts
                  </Text>
                </View>
              )}

              {isUserPlan && (
                <View style={styles.activeLabel}>
                  <CheckCircle2 size={14} color={palette.accent} />
                  <Text style={[styles.activeText, { color: palette.accentText }]}>
                    {isVn ? 'Đang dùng' : 'Active'}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Chi tiết tính năng của gói đang chọn */}
      {currentPlan && (
        <View style={[styles.detailSection, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
          <View style={styles.detailHeader}>
            <Zap size={18} color={getPlanColor(currentPlan.code)} />
            <Text style={[styles.detailTitle, { color: palette.text }]}>
              {isVn
                ? `Chi tiết gói: ${getPlanDisplayName(currentPlan.code, currentPlan.name)}`
                : `Features: ${getPlanDisplayName(currentPlan.code, currentPlan.name)}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureRow}>
            <Check size={16} color={palette.accent} />
            <Text style={[styles.featureText, { color: palette.text }]}>
              {isVn ? 'Giới hạn quét:' : 'Scan limit:'}{' '}
              <Text style={{ fontWeight: '700', color: getPlanColor(currentPlan.code) }}>
                {formatMaxScans(currentPlan.features.max_scans_per_day)}
              </Text>
            </Text>
          </View>

          <View style={styles.featureRow}>
            {currentPlan.features.has_ai_nutritionist ? (
              <Check size={16} color={palette.accent} />
            ) : (
              <Text style={[styles.bulletNo, { color: palette.danger }]}>✕</Text>
            )}
            <Text style={[styles.featureText, { color: currentPlan.features.has_ai_nutritionist ? palette.text : palette.muted }]}>
              {isVn ? 'Chuyên gia dinh dưỡng AI (Tư vấn trực tiếp)' : 'AI Nutritionist Advice (Chatbot)'}
            </Text>
          </View>

          <View style={styles.featureRow}>
            {currentPlan.features.has_health_sync ? (
              <Check size={16} color={palette.accent} />
            ) : (
              <Text style={[styles.bulletNo, { color: palette.danger }]}>✕</Text>
            )}
            <Text style={[styles.featureText, { color: currentPlan.features.has_health_sync ? palette.text : palette.muted }]}>
              {isVn ? 'Đồng bộ Apple Health (Chỉ khả dụng cho Admin/VVIP)' : 'Sync to Apple Health (Admin/VVIP only)'}
            </Text>
          </View>

          <View style={styles.featureRow}>
            <Check size={16} color={palette.accent} />
            <Text style={[styles.featureText, { color: palette.text }]}>
              {isVn ? 'Thời gian xem lịch sử:' : 'History time limit:'}{' '}
              <Text style={{ fontWeight: '600' }}>
                {formatHistoryLimit(currentPlan.features.history_days_limit)}
              </Text>
            </Text>
          </View>

          <View style={styles.featureRow}>
            {currentPlan.vip_points_reward > 0 ? (
              <Check size={16} color={palette.accent} />
            ) : (
              <Text style={[styles.bulletNo, { color: palette.danger }]}>✕</Text>
            )}
            <Text style={[styles.featureText, { color: currentPlan.vip_points_reward > 0 ? palette.text : palette.muted }]}>
              {isVn ? `Điểm VIP thưởng: +${currentPlan.vip_points_reward} điểm` : `Bonus VIP rank points: +${currentPlan.vip_points_reward}`}
            </Text>
          </View>
        </View>
      )}

      {/* Box thông báo bảo mật */}
      {currentPlan && currentPlan.code !== 'basic' && (
        <View style={[styles.infoBox, { backgroundColor: palette.accentSoft, borderColor: palette.border }]}>
          <ShieldAlert size={18} color={palette.accent} />
          <Text style={[styles.infoBoxText, { color: palette.accentText }]}>
            {isVn
              ? 'Tài khoản Admin mới có quyền gọi API thanh toán Mock lên Server. Tài khoản thường sẽ thực hiện cập nhật demo client.'
              : 'Admin accounts are allowed to issue Server Mock purchases. Standard accounts will simulate locally.'}
          </Text>
        </View>
      )}

      {/* Nút hành động */}
      <View style={styles.actionContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={palette.accent} style={{ marginVertical: spacing.md }} />
        ) : (
          currentPlan && (
            <PrimaryButton
              palette={palette}
              label={
                user?.subscription_tier === currentPlan.code || (!user?.subscription_tier && currentPlan.code === 'basic')
                  ? (isVn ? 'Đang sử dụng gói này' : 'Currently Active')
                  : (getPlanLevel(user?.subscription_tier) > getPlanLevel(currentPlan.code)
                      ? (isVn ? 'Gói thấp hơn gói hiện tại' : 'Lower Than Current Plan')
                      : (isVn ? `Nâng cấp lên gói ${getPlanDisplayName(currentPlan.code, currentPlan.name)}` : `Upgrade to ${getPlanDisplayName(currentPlan.code, currentPlan.name)}`))
              }
              onPress={handlePurchase}
              icon={Zap}
            />
          )
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  sparkleIcon: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  plansScroll: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
    gap: spacing.md,
  },
  planCard: {
    width: 140,
    height: 185,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  planBadgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    marginTop: 2,
  },
  pointBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  detailSection: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.15)',
    marginVertical: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  bulletNo: {
    fontSize: 13,
    fontWeight: '800',
    width: 16,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infoBoxText: {
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600',
  },
  actionContainer: {
    width: '100%',
    paddingBottom: spacing.xxl,
  },
});
