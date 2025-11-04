import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { IconButton, FAB, Portal, Modal, Surface, Text, ActivityIndicator, Chip, Button } from 'react-native-paper';
import * as ExpoLocation from 'expo-location';
import { SafeAreaLayout } from '../components/layout';
import { PostCard } from '../components/common/PostCard';
import { useAppTheme } from '../providers/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Post, Location } from '../types/post';
import { postsService } from '../services/posts.service';
import { getDistanceBetweenLocations, formatDistance } from '../utils/location';

// 條件導入 MapView
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
}

type Props = NativeStackScreenProps<RootStackParamList, 'MapSearch'>;

const INITIAL_REGION: Region = {
  latitude: 25.0330, // 台北 101
  longitude: 121.5654,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapSearchScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  
  // Web 平台顯示提示
  if (Platform.OS === 'web') {
    return (
      <SafeAreaLayout>
        <View style={styles.container}>
          <Surface style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <Text variant="titleMedium" style={styles.title}>
              地圖搜尋
            </Text>
          </Surface>
          <View style={styles.webNotice}>
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
              🗺️
            </Text>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              地圖搜尋功能
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
              此功能僅適用於行動裝置
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              請使用 iOS 或 Android 設備訪問此功能
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24 }}
            >
              返回
            </Button>
          </View>
        </View>
      </SafeAreaLayout>
    );
  }
  
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [showListView, setShowListView] = useState(false);

  // 獲取用戶當前位置
  useEffect(() => {
    (async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });
        const newLocation: Location = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newLocation);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  // 加載附近文章
  const loadNearbyPosts = useCallback(async (centerLocation?: Location) => {
    const location = centerLocation || userLocation;
    if (!location) return;

    try {
      setIsLoading(true);
      const response = await postsService.getPosts({
        page: 1,
        limit: 50,
        sort: 'nearest',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm: 10, // 10km 半徑
        },
      });
      setPosts(response.posts.filter(post => post.location)); // 只顯示有位置的文章
    } catch (error) {
      console.error('加載文章失敗:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  // 初始加載
  useEffect(() => {
    if (userLocation) {
      loadNearbyPosts();
    }
  }, [userLocation, loadNearbyPosts]);

  // 地圖區域變更時重新加載
  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    loadNearbyPosts({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  }, [loadNearbyPosts]);

  // 回到當前位置
  const handleGoToMyLocation = async () => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });
        const newLocation: Location = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newLocation);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
  };

  // 處理標記點擊
  const handleMarkerPress = (post: Post) => {
    setSelectedPost(post);
  };

  // 導航到文章詳情
  const handlePostPress = (postId: string) => {
    setSelectedPost(null);
    navigation.navigate('PostDetails', { postId });
  };

  return (
    <SafeAreaLayout>
      <View style={styles.container}>
        {/* 頂部工具欄 */}
        <Surface style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="titleMedium" style={styles.title}>
            地圖搜尋
          </Text>
          <View style={styles.toolbarActions}>
            <Chip
              icon="map-marker"
              style={styles.chip}
              textStyle={{ fontSize: 12 }}
            >
              {posts.length} 篇
            </Chip>
            <IconButton
              icon={showListView ? "map" : "format-list-bulleted"}
              size={24}
              onPress={() => setShowListView(!showListView)}
            />
          </View>
        </Surface>

        {/* 地圖視圖 */}
        {!showListView && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {posts.map((post) => {
              if (!post.location) return null;
              return (
                <Marker
                  key={post.id}
                  coordinate={{
                    latitude: post.location.latitude,
                    longitude: post.location.longitude,
                  }}
                  title={post.title}
                  description={post.author.username}
                  onPress={() => handleMarkerPress(post)}
                />
              );
            })}
          </MapView>
        )}

        {/* 列表視圖 */}
        {showListView && (
          <View style={styles.listContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                  載入中...
                </Text>
              </View>
            ) : posts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text variant="bodyLarge">附近沒有文章</Text>
                <Text variant="bodySmall" style={styles.emptyHint}>
                  試試移動地圖或擴大搜尋範圍
                </Text>
              </View>
            ) : (
              <View style={styles.postsList}>
                {posts.map((post) => {
                  const distance = userLocation && post.location
                    ? getDistanceBetweenLocations(userLocation, post.location)
                    : undefined;
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      distance={distance}
                      distanceFormatted={distance ? formatDistance(distance) : undefined}
                      onPress={() => handlePostPress(post.id)}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* 懸浮按鈕 - 回到當前位置 */}
        {!showListView && (
          <FAB
            icon="crosshairs-gps"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            onPress={handleGoToMyLocation}
            size="small"
          />
        )}

        {/* 載入指示器 */}
        {isLoading && !showListView && (
          <View style={styles.loadingOverlay}>
            <Surface style={styles.loadingCard}>
              <ActivityIndicator size="small" />
              <Text variant="bodySmall" style={styles.loadingCardText}>
                載入中...
              </Text>
            </Surface>
          </View>
        )}

        {/* 選中的文章預覽 */}
        <Portal>
          <Modal
            visible={!!selectedPost}
            onDismiss={() => setSelectedPost(null)}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedPost && (
              <Surface style={styles.modalContent}>
                <PostCard
                  post={selectedPost}
                  distance={
                    userLocation && selectedPost.location
                      ? getDistanceBetweenLocations(userLocation, selectedPost.location)
                      : undefined
                  }
                  distanceFormatted={
                    userLocation && selectedPost.location
                      ? formatDistance(
                          getDistanceBetweenLocations(userLocation, selectedPost.location)
                        )
                      : undefined
                  }
                  onPress={() => handlePostPress(selectedPost.id)}
                />
              </Surface>
            )}
          </Modal>
        </Portal>
      </View>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    marginRight: 4,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyHint: {
    marginTop: 8,
    color: '#666',
  },
  postsList: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    elevation: 4,
  },
  loadingCardText: {
    marginLeft: 8,
  },
  modalContainer: {
    margin: 20,
  },
  modalContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});
