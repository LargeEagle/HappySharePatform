import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, SegmentedButtons, FAB } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { PostCard } from '../components/common/PostCard';
import { usePosts } from '../hooks/usePosts';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Post } from '../types/post';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const [sortValue, setSortValue] = useState<'latest' | 'popular'>('latest');
  const {
    posts,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
    changeSort
  } = usePosts({
    page: 1,
    limit: 10,
    sort: sortValue
  });

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => {
        navigation.navigate('PostDetails', { postId: item.id });
      }}
    />
  ), []);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <ActivityIndicator
        animating={true}
        style={styles.loadingIndicator}
      />
    );
  }, [hasMore]);

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  return (
    <SafeAreaLayout>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <SegmentedButtons
          value={sortValue}
          onValueChange={(value) => {
            setSortValue(value as 'latest' | 'popular');
            changeSort(value as 'latest' | 'popular');
          }}
          buttons={[
            { value: 'latest', label: '最新' },
            { value: 'popular', label: '熱門' },
          ]}
        />
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={handleRefresh}
            style={styles.retryButton}
          >
            重試
          </Button>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && posts.length === 0}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text variant="bodyLarge">
                  目前還沒有任何貼文
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  list: {
    paddingVertical: 8,
  },
  loadingIndicator: {
    paddingVertical: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;