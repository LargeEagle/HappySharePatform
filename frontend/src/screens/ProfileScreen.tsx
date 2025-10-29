import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { PostCard } from '../components/common/PostCard';
import { useAppTheme } from '../providers/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, getUserPosts } from '../services/user.service';
import { User } from '../types/auth';
import { Post } from '../types/post';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const { user: currentUser, logout } = useAuth();
  const userId = route.params?.userId || currentUser?.id;
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isOwnProfile = userId === currentUser?.id;

  // 載入用戶資料
  const loadUserProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setError(null);
      const profileData = await getUserProfile(userId);
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入用戶資料失敗');
    }
  }, [userId]);

  // 載入用戶文章
  const loadUserPosts = useCallback(async (pageNum: number, refresh: boolean = false) => {
    if (!userId) return;
    
    try {
      const result = await getUserPosts(userId, pageNum, 10);
      if (refresh) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入文章失敗');
    }
  }, [userId]);

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadUserProfile(),
        loadUserPosts(1, true)
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [loadUserProfile, loadUserPosts]);

  // 下拉重新整理
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    await Promise.all([
      loadUserProfile(),
      loadUserPosts(1, true)
    ]);
    setIsRefreshing(false);
  }, [loadUserProfile, loadUserPosts]);

  // 載入更多
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadUserPosts(nextPage, false);
    }
  }, [isLoading, hasMore, page, loadUserPosts]);

  // 編輯資料
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // 登出
  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  // 渲染文章項目
  const renderPost = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
    />
  ), [navigation]);

  // 渲染列表底部
  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <ActivityIndicator
        animating={true}
        style={styles.loadingIndicator}
      />
    );
  }, [hasMore]);

  if (isLoading) {
    return (
      <SafeAreaLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaLayout>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaLayout>
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
            {error}
          </Text>
          <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
            重試
          </Button>
        </View>
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
            {/* 用戶頭像和基本資料 */}
            <View style={styles.profileSection}>
              <Avatar.Text
                size={80}
                label={user?.username.substring(0, 2).toUpperCase() || '??'}
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
              <View style={styles.profileInfo}>
                <Text variant="headlineSmall" style={styles.username}>
                  {user?.username}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                  {user?.email}
                </Text>
              </View>
            </View>

            {/* 個人簡介 */}
            {user?.bio && (
              <Text variant="bodyMedium" style={styles.bio}>
                {user.bio}
              </Text>
            )}

            {/* 位置和網站 */}
            {(user?.location || user?.website) && (
              <View style={styles.additionalInfo}>
                {user.location && (
                  <View style={styles.infoRow}>
                    <IconButton icon="map-marker" size={16} />
                    <Text variant="bodySmall">{user.location}</Text>
                  </View>
                )}
                {user.website && (
                  <View style={styles.infoRow}>
                    <IconButton icon="link" size={16} />
                    <Text variant="bodySmall">{user.website}</Text>
                  </View>
                )}
              </View>
            )}

            {/* 統計數據 */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleMedium">{user?.stats?.postsCount || 0}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  文章
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">{user?.stats?.followersCount || 0}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  粉絲
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">{user?.stats?.followingCount || 0}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  關注
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">{user?.stats?.likesCount || 0}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                  獲讚
                </Text>
              </View>
            </View>

            {/* 操作按鈕 */}
            {isOwnProfile && (
              <View style={styles.actionsContainer}>
                <Button
                  mode="contained"
                  onPress={handleEditProfile}
                  style={styles.actionButton}
                  icon="pencil"
                >
                  編輯資料
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleLogout}
                  style={styles.actionButton}
                  icon="logout"
                >
                  登出
                </Button>
              </View>
            )}

            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.postsTitle}>
              我的文章
            </Text>
          </View>
        }
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge">尚未發布任何文章</Text>
            </View>
          )
        }
      />
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  header: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    marginBottom: 12,
    lineHeight: 20,
  },
  additionalInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  postsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingIndicator: {
    paddingVertical: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
});

export default ProfileScreen;
