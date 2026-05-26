import { useRouter } from 'expo-router';
import { Search, X, ChevronRight, History as HistoryIcon, UtensilsCrossed } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { listScans } from '../src/apis/scan';
import { useAppTheme } from '../src/hooks/use_app_theme';
import type { Scan } from '../src/interfaces/scan';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { AppCard, BackHeader, Screen, radius, spacing } from '@/src/ui';

export default function HistoryScreen() {
  const router = useRouter();
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const { palette } = useAppTheme();
  const locale = getLocale(selectedCountry);

  const [scans, setScans] = useState<Scan[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchScans = useCallback(
    async (pageNum: number, searchKeyword: string, isRefresh: boolean) => {
      try {
        const res = await listScans({
          page: pageNum,
          size: 15,
          keyword: searchKeyword || undefined,
        });

        if (res.success && res.data?.data) {
          const list = res.data.data;
          if (isRefresh) {
            setScans(list);
          } else {
            setScans((prev) => [...prev, ...list]);
          }
          setHasMore(list.length === 15);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching scans:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchScans(1, keyword, true);
  }, [keyword, fetchScans]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchScans(1, keyword, true);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchScans(nextPage, keyword, false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(selectedCountry === 'vn' ? 'vi-VN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Screen palette={palette} scrollable={false}>
      <BackHeader palette={palette} title={locale.historyPage.title} onBack={() => router.back()} />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
        <Search size={18} color={palette.muted} />
        <TextInput
          style={[styles.searchInput, { color: palette.text }]}
          placeholder={locale.historyPage.searchPlaceholder}
          placeholderTextColor={palette.muted}
          value={keyword}
          onChangeText={setKeyword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {keyword.length > 0 ? (
          <Pressable onPress={() => setKeyword('')}>
            <X size={18} color={palette.text} />
          </Pressable>
        ) : null}
      </View>

      {/* Scans List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : scans.length === 0 ? (
        <View style={styles.centerContainer}>
          <HistoryIcon size={48} color={palette.muted} />
          <Text style={[styles.emptyText, { color: palette.text }]}>{locale.historyPage.noHistory}</Text>
          <Pressable
            style={[styles.emptyButton, { backgroundColor: palette.accent }]}
            onPress={() => router.replace('/scan')}
          >
            <Text style={styles.emptyButtonText}>{locale.historyPage.scanNew}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={palette.accent} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={palette.accent} style={{ marginVertical: spacing.md }} />
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push({ pathname: '/result', params: { id: item.id, from: 'history' } })}
              style={({ pressed }) => [
                styles.itemPressable,
                pressed && styles.pressed,
              ]}
            >
              <AppCard palette={palette} style={styles.card}>
                <View style={styles.itemRow}>
                  {/* Thumbnail */}
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <Image source={{ uri: item.image_urls[0] }} style={styles.thumbnail} />
                  ) : (
                    <View style={[styles.thumbnailFallback, { backgroundColor: palette.accentSoft }]}>
                      <UtensilsCrossed size={20} color={palette.accent} />
                    </View>
                  )}

                  {/* Info */}
                  <View style={styles.infoCol}>
                    <Text style={[styles.mealName, { color: palette.text }]} numberOfLines={1}>
                      {item.analysis.meal_name}
                    </Text>
                    <Text style={[styles.dateText, { color: palette.subText }]}>
                      {formatDate(item.created_at)}
                    </Text>

                    {/* Macro chips */}
                    <View style={styles.chipsRow}>
                      <View style={[styles.chip, { backgroundColor: palette.accentSoft }]}>
                        <Text style={[styles.chipText, { color: palette.accentText }]}>
                          {item.analysis.calories} kcal
                        </Text>
                      </View>
                      <View style={[styles.chip, { backgroundColor: palette.accentSoft }]}>
                        <Text style={[styles.chipText, { color: palette.accentText }]}>
                          {item.analysis.protein}g P
                        </Text>
                      </View>
                      <View style={[styles.chip, { backgroundColor: palette.accentSoft }]}>
                        <Text style={[styles.chipText, { color: palette.accentText }]}>
                          {item.analysis.carbs}g C
                        </Text>
                      </View>
                    </View>
                  </View>

                  <ChevronRight size={18} color={palette.muted} />
                </View>
              </AppCard>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingLeft: spacing.sm,
    fontSize: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyButton: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  itemPressable: {
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  card: {
    padding: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  thumbnailFallback: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
