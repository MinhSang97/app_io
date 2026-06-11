import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Award, Zap, Sparkles, ChevronRight, History, Gift, Star, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { BackHeader, radius, Screen, spacing, AppCard, PrimaryButton } from '@/src/ui';
import {
  listVipRanks as getVIPRanks,
  listVipRewards as getVIPRewards,
  redeemVipReward as redeemVIPReward,
  listVipRedemptionHistory as getVIPRedemptionHistory,
} from '../src/apis/vip';
import type { VIPRank, VIPReward, VIPRedemption } from '../src/interfaces/vip';
import { get_user_information } from '../src/apis/user/user-information';

const { width } = Dimensions.get('window');

// Localized strings
const translations: Record<string, any> = {
  vn: {
    title: 'Đặc quyền VIP & Đổi thưởng',
    membershipCard: 'Thẻ thành viên VIP',
    activePlan: 'Gói đang dùng',
    vipRank: 'Hạng VIP',
    availablePoints: 'Điểm khả dụng',
    totalEarned: 'Tổng tích lũy',
    nextRankProgress: 'Độ tiến thăng hạng:',
    nextRankInfo: 'Cần thêm {points} điểm để đạt hạng {rank}',
    maxRankReached: 'Đã đạt hạng VIP cao nhất!',
    tabRedeem: 'Đổi phần thưởng',
    tabHistory: 'Lịch sử đổi quà',
    pointsUnit: 'Pts',
    redeemButton: 'Đổi quà',
    insufficientPoints: 'Không đủ điểm',
    confirmTitle: 'Xác nhận đổi quà',
    confirmMsg: 'Bạn có chắc chắn muốn dùng {cost} điểm để đổi "{name}" không?',
    cancel: 'Hủy',
    confirm: 'Đồng ý',
    successTitle: 'Đổi quà thành công',
    successMsg: 'Bạn đã đổi quà thành công: "{name}".',
    errorTitle: 'Lỗi',
    noRewards: 'Không có phần thưởng khả dụng.',
    noHistory: 'Chưa có lịch sử đổi quà.',
    historySpent: 'Tiêu phí: -{points} điểm',
    historyStatus: 'Trạng thái:',
    historyDate: 'Ngày đổi:',
    types: {
      discount_subscription: 'Giảm giá gói',
      bonus_scans: 'Thêm lượt quét',
      extend_days: 'Gia hạn gói',
    },
  },
  us: {
    title: 'VIP Privileges & Rewards',
    membershipCard: 'VIP Membership Card',
    activePlan: 'Active Plan',
    vipRank: 'VIP Rank',
    availablePoints: 'Available Points',
    totalEarned: 'Lifetime Points',
    nextRankProgress: 'Next Rank Progress:',
    nextRankInfo: 'Need {points} more points to reach {rank}',
    maxRankReached: 'Highest VIP rank reached!',
    tabRedeem: 'Redeem Rewards',
    tabHistory: 'Redemption History',
    pointsUnit: 'Pts',
    redeemButton: 'Redeem',
    insufficientPoints: 'Insufficient points',
    confirmTitle: 'Confirm Redemption',
    confirmMsg: 'Are you sure you want to spend {cost} points to redeem "{name}"?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    successTitle: 'Redemption Success',
    successMsg: 'Successfully redeemed: "{name}".',
    errorTitle: 'Error',
    noRewards: 'No active rewards available.',
    noHistory: 'No redemption history yet.',
    historySpent: 'Spent: -{points} Pts',
    historyStatus: 'Status:',
    historyDate: 'Date:',
    types: {
      discount_subscription: 'Subscription discount',
      bonus_scans: 'Bonus scans',
      extend_days: 'Extend plan duration',
    },
  },
};

export default function VIPScreen() {
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { palette } = useAppTheme();
  
  const isVn = selectedCountry === 'vn';
  const t = translations[isVn ? 'vn' : 'us'];

  const [activeTab, setActiveTab] = useState<'redeem' | 'history'>('redeem');
  const [loading, setLoading] = useState<boolean>(false);
  const [ranks, setRanks] = useState<VIPRank[]>([]);
  const [rewards, setRewards] = useState<VIPReward[]>([]);
  const [history, setHistory] = useState<VIPRedemption[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchVIPData = async () => {
    setLoading(true);
    try {
      const [ranksRes, rewardsRes, historyRes] = await Promise.all([
        getVIPRanks(),
        getVIPRewards(),
        getVIPRedemptionHistory(),
      ]);

      if (ranksRes.success && ranksRes.data?.data) {
        setRanks(ranksRes.data.data);
      }
      if (rewardsRes.success && rewardsRes.data?.data) {
        setRewards(rewardsRes.data.data);
      }
      if (historyRes.success && historyRes.data?.data) {
        setHistory(historyRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch VIP data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVIPData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVIPData();
    // Refresh user profile details
    const userRes = await get_user_information();
    if (userRes.success && userRes.data?.data) {
      setUser(userRes.data.data);
    }
    setRefreshing(false);
  };

  const getNextRankInfo = (earned: number) => {
    if (ranks.length === 0) {
      // Hardcoded fallback matching backend seed
      const fallbackRanks = [
        { code: 'bronze', name: isVn ? 'Đồng' : 'Bronze', min_points: 0 },
        { code: 'silver', name: isVn ? 'Bạc' : 'Silver', min_points: 150 },
        { code: 'gold', name: isVn ? 'Vàng' : 'Gold', min_points: 250 },
        { code: 'platinum', name: isVn ? 'Bạch Kim' : 'Platinum', min_points: 1500 },
        { code: 'diamond', name: isVn ? 'Kim Cương' : 'Diamond', min_points: 3500 },
      ];
      return findNextRank(fallbackRanks, earned);
    }
    return findNextRank(ranks, earned);
  };

  const findNextRank = (ranksList: any[], earned: number) => {
    // Sort ranks by min_points
    const sorted = [...ranksList].sort((a, b) => a.min_points - b.min_points);
    for (let i = 0; i < sorted.length; i++) {
      if (earned < sorted[i].min_points) {
        const prevRank = sorted[i - 1] || { min_points: 0 };
        return {
          next: sorted[i].name,
          target: sorted[i].min_points,
          currentMin: prevRank.min_points,
        };
      }
    }
    return null; // Max rank reached
  };

  const handleRedeem = (reward: VIPReward) => {
    const balance = user?.vip_points_balance || 0;
    if (balance < reward.points_cost) {
      Alert.alert(t.errorTitle, t.insufficientPoints);
      return;
    }

    const message = t.confirmMsg
      .replace('{cost}', String(reward.points_cost))
      .replace('{name}', reward.name);

    Alert.alert(
      t.confirmTitle,
      message,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.confirm,
          onPress: async () => {
            setLoading(true);
            try {
              const res = await redeemVIPReward(reward.id);
              if (res.success && res.data) {
                const updatedMsg = t.successMsg.replace('{name}', reward.name);
                Alert.alert(t.successTitle, updatedMsg);
                
                // Refresh user information
                const userRes = await get_user_information();
                if (userRes.success && userRes.data?.data) {
                  setUser(userRes.data.data);
                }

                // Refresh history
                const historyRes = await getVIPRedemptionHistory();
                if (historyRes.success && historyRes.data?.data) {
                  setHistory(historyRes.data.data);
                }
              } else {
                Alert.alert(t.errorTitle, res.error || 'Failed to redeem reward.');
              }
            } catch (err) {
              Alert.alert(t.errorTitle, 'An error occurred during redemption.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const planNames: Record<string, Record<string, string>> = {
    basic: { vn: 'Cơ bản', us: 'Basic' },
    plus: { vn: 'Plus', us: 'Plus' },
    pro: { vn: 'Pro', us: 'Pro' },
    ultra: { vn: 'Ultra', us: 'Ultra' },
  };

  const getPlanDisplayName = (code?: string) => {
    const key = code || 'basic';
    return planNames[key]?.[isVn ? 'vn' : 'us'] || key;
  };

  const getRankColor = (code?: string) => {
    const key = (code || 'bronze').toLowerCase();
    switch (key) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#9ca3af';
      case 'gold': return '#fbbf24';
      case 'platinum': return '#60a5fa';
      case 'diamond': return '#a855f7';
      default: return '#fbbf24';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount_subscription': return <Award size={20} color="#fbbf24" />;
      case 'bonus_scans': return <Zap size={20} color="#3b82f6" />;
      case 'extend_days': return <Sparkles size={20} color="#a855f7" />;
      default: return <Gift size={20} color="#ec4899" />;
    }
  };

  // Progress calculations
  const earnedPoints = user?.vip_points_earned || 0;
  const balancePoints = user?.vip_points_balance || 0;
  const nextRank = getNextRankInfo(earnedPoints);
  
  let progress = 1;
  if (nextRank) {
    const range = nextRank.target - nextRank.currentMin;
    const currentOffset = earnedPoints - nextRank.currentMin;
    progress = Math.max(0, Math.min(1, currentOffset / range));
  }

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isVn ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Screen palette={palette}>
      <BackHeader
        palette={palette}
        title={t.title}
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        {/* Membership card with high premium look */}
        <AppCard
          palette={palette}
          style={[
            styles.membershipCard,
            {
              backgroundColor: palette.cardBg,
              borderColor: getRankColor(user?.vip_rank),
              shadowColor: getRankColor(user?.vip_rank),
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Star size={24} color={getRankColor(user?.vip_rank)} style={{ marginRight: 6 }} />
              <Text style={[styles.cardTitle, { color: palette.text }]}>{t.membershipCard}</Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: getRankColor(user?.vip_rank) + '20', borderColor: getRankColor(user?.vip_rank) },
              ]}
            >
              <Text style={[styles.badgeText, { color: getRankColor(user?.vip_rank) }]}>
                {user?.vip_rank || 'Bronze'}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardInfoCol}>
              <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>{t.activePlan}</Text>
              <Text style={[styles.cardInfoValue, { color: palette.text }]}>
                {getPlanDisplayName(user?.subscription_tier)}
              </Text>
            </View>

            <View style={styles.cardInfoCol}>
              <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>{t.availablePoints}</Text>
              <Text style={[styles.cardInfoValue, { color: getRankColor(user?.vip_rank), fontWeight: '800' }]}>
                {balancePoints} <Text style={{ fontSize: 13, fontWeight: '400' }}>{t.pointsUnit}</Text>
              </Text>
            </View>

            <View style={styles.cardInfoCol}>
              <Text style={[styles.cardInfoLabel, { color: palette.muted }]}>{t.totalEarned}</Text>
              <Text style={[styles.cardInfoValue, { color: palette.text }]}>
                {earnedPoints} <Text style={{ fontSize: 13, fontWeight: '400' }}>{t.pointsUnit}</Text>
              </Text>
            </View>
          </View>

          {/* Progress bar to next VIP level */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabelText, { color: palette.subText }]}>{t.nextRankProgress}</Text>
              <Text style={[styles.progressLabelText, { color: palette.text, fontWeight: '700' }]}>
                {nextRank
                  ? t.nextRankInfo
                      .replace('{points}', String(nextRank.target - earnedPoints))
                      .replace('{rank}', nextRank.next)
                  : t.maxRankReached}
              </Text>
            </View>
            
            {nextRank && (
              <View style={[styles.progressBarBg, { backgroundColor: palette.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: getRankColor(user?.vip_rank),
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </AppCard>

        {/* Tab selection */}
        <View style={[styles.tabBar, { borderColor: palette.border }]}>
          <Pressable
            onPress={() => setActiveTab('redeem')}
            style={[
              styles.tab,
              activeTab === 'redeem' && {
                borderBottomColor: palette.accent,
                borderBottomWidth: 3,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'redeem' ? palette.accent : palette.muted },
                activeTab === 'redeem' && { fontWeight: '700' },
              ]}
            >
              {t.tabRedeem}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('history')}
            style={[
              styles.tab,
              activeTab === 'history' && {
                borderBottomColor: palette.accent,
                borderBottomWidth: 3,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'history' ? palette.accent : palette.muted },
                activeTab === 'history' && { fontWeight: '700' },
              ]}
            >
              {t.tabHistory}
            </Text>
          </Pressable>
        </View>

        {/* Refresh button */}
        <Pressable
          onPress={handleRefresh}
          style={({ pressed }) => [
            styles.refreshButton,
            { backgroundColor: palette.cardBg, borderColor: palette.border },
            pressed && styles.pressed,
          ]}
        >
          <RefreshCw size={15} color={palette.accent} style={{ marginRight: 6 }} />
          <Text style={[styles.refreshText, { color: palette.accentText }]}>
            {isVn ? 'Làm mới dữ liệu' : 'Refresh Data'}
          </Text>
        </Pressable>

        {/* Content list */}
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: spacing.xxl }} />
        ) : activeTab === 'redeem' ? (
          /* Redeem rewards tab */
          rewards.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.muted }]}>{t.noRewards}</Text>
          ) : (
            <View style={styles.rewardsList}>
              {rewards.map((item) => {
                const canRedeem = balancePoints >= item.points_cost;
                return (
                  <AppCard
                    key={item.id}
                    palette={palette}
                    style={[
                      styles.rewardCard,
                      { backgroundColor: palette.cardBg, borderColor: palette.border },
                    ]}
                  >
                    <View style={styles.rewardLeft}>
                      <View style={[styles.rewardIconContainer, { backgroundColor: palette.accentSoft }]}>
                        {getRewardIcon(item.type)}
                      </View>
                      <View style={styles.rewardTextInfo}>
                        <Text style={[styles.rewardName, { color: palette.text }]}>{item.name}</Text>
                        <Text style={[styles.rewardCost, { color: palette.accent }]}>
                          {item.points_cost} {t.pointsUnit}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      disabled={!canRedeem}
                      onPress={() => handleRedeem(item)}
                      style={({ pressed }) => [
                        styles.redeemBtn,
                        {
                          backgroundColor: canRedeem ? palette.accent : palette.border,
                        },
                        pressed && canRedeem && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.redeemBtnText,
                          { color: canRedeem ? '#ffffff' : palette.muted },
                        ]}
                      >
                        {canRedeem ? t.redeemButton : t.insufficientPoints}
                      </Text>
                    </Pressable>
                  </AppCard>
                );
              })}
            </View>
          )
        ) : (
          /* History tab */
          history.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.muted }]}>{t.noHistory}</Text>
          ) : (
            <View style={styles.historyList}>
              {history.map((item) => (
                <AppCard
                  key={item.id}
                  palette={palette}
                  style={[
                    styles.historyCard,
                    { backgroundColor: palette.cardBg, borderColor: palette.border },
                  ]}
                >
                  <View style={styles.historyHeader}>
                    <CheckCircle2 size={16} color={palette.accent} style={{ marginRight: 6 }} />
                    <Text style={[styles.historyRewardName, { color: palette.text }]}>
                      {item.reward_name}
                    </Text>
                  </View>
                  
                  <View style={styles.historyMeta}>
                    <Text style={[styles.historyLabel, { color: palette.muted }]}>
                      {t.historySpent.replace('{points}', String(item.points_spent))}
                    </Text>
                    <Text style={[styles.historyLabel, { color: palette.muted }]}>
                      {t.historyDate} {formatDateTime(item.created_at)}
                    </Text>
                  </View>
                </AppCard>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  membershipCard: {
    borderWidth: 2.5,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginVertical: spacing.md,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardInfoCol: {
    alignItems: 'center',
    flex: 1,
  },
  cardInfoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardInfoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: spacing.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rewardsList: {
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  rewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  rewardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rewardTextInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 15,
    fontWeight: '700',
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  redeemBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.md,
    minWidth: 85,
    alignItems: 'center',
  },
  redeemBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: spacing.xxl,
    fontStyle: 'italic',
  },
  historyList: {
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  historyCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyRewardName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  historyLabel: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.8,
  },
});
