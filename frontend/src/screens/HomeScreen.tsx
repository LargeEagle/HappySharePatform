import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, SegmentedButtons, FAB, IconButton } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { PostCard } from '../components/common/PostCard';
import { LocationFilter } from '../components/common';
import { usePosts } from '../hooks/usePosts';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Post, Location } from '../types/post';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const [sortValue, setSortValue] = useState<'latest' | 'popular' | 'nearest'>('latest');
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState<{
    location: Location | null;
    radiusKm: number;
  }>({
    location: null,
    radiusKm: 10,
  });
  
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
    sort: sortValue,
    location: locationFilter.location
      ? {
          latitude: locationFilter.location.latitude,
          longitude: locationFilter.location.longitude,
          radiusKm: locationFilter.radiusKm,
        }
      : undefined,
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

  const handleSearchPress = () => {
    console.log('HomeScreen: Search button pressed');
    navigation.navigate('Search');
  };

  const handleLocationFilterApply = (location: Location | null, radiusKm: number) => {
    setLocationFilter({ location, radiusKm });
    if (location) {
      setSortValue('nearest');
      changeSort('nearest');
    }
    refresh();
  };

  return (
    <SafeAreaLayout>
      <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
        <View style={styles.headerContent}>
          <SegmentedButtons
            value={sortValue}
            onValueChange={(value) => {
              const newSort = value as 'latest' | 'popular' | 'nearest';
              setSortValue(newSort);
              changeSort(newSort);
            }}
            buttons={[
              { value: 'latest', label: '最新' },
              { value: 'popular', label: '熱門' },
              { 
                value: 'nearest', 
                label: '附近',
                disabled: !locationFilter.location 
              },
            ]}
            style={styles.segmentedButtons}
          />
          <View style={styles.headerActions}>
            <IconButton
              icon="map"
              size={20}
              onPress={() => navigation.navigate('MapSearch')}
            />
            <IconButton
              icon={locationFilter.location ? "map-marker" : "map-marker-outline"}
              size={20}
              onPress={() => setShowLocationFilter(true)}
            />
            <Button 
              mode="text" 
              icon="magnify" 
              onPress={handleSearchPress}
              compact
            >
              搜尋
            </Button>
          </View>
        </View>
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

      {/* 位置篩選模態框 */}
      <LocationFilter
        visible={showLocationFilter}
        onDismiss={() => setShowLocationFilter(false)}
        onApply={handleLocationFilterApply}
        currentLocation={locationFilter.location}
        currentRadius={locationFilter.radiusKm}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreatePost}
      />
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentedButtons: {
    flex: 1,
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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