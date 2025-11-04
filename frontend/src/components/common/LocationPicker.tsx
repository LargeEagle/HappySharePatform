import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Portal, Modal, Text, Button, TextInput, ActivityIndicator, IconButton } from 'react-native-paper';
import * as ExpoLocation from 'expo-location';
import { useAppTheme } from '../../providers/ThemeProvider';
import type { Location } from '../../types/post';

// Region 類型定義
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// 條件導入 MapView（僅在非 Web 平台）
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

interface LocationPickerProps {
  visible: boolean;
  onDismiss: () => void;
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

export function LocationPicker({
  visible,
  onDismiss,
  onLocationSelect,
  initialLocation
}: LocationPickerProps) {
  const { theme } = useAppTheme();
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 25.0330, // 台北 101 默認
    longitude: initialLocation?.longitude || 121.5654,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: initialLocation?.latitude || 25.0330,
    longitude: initialLocation?.longitude || 121.5654,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [locationInfo, setLocationInfo] = useState<Location | null>(initialLocation || null);

  // 請求位置權限
  const requestLocationPermission = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('權限被拒絕', '需要位置權限才能使用此功能');
        return false;
      }
      return true;
    } catch (error) {
      console.error('請求位置權限失敗:', error);
      return false;
    }
  };

  // 獲取當前位置
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      setIsLoadingLocation(true);
      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const newPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarkerPosition(newPosition);
      setRegion({
        ...newPosition,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // 反向地理編碼獲取地址
      await reverseGeocode(newPosition.latitude, newPosition.longitude);
    } catch (error) {
      console.error('獲取當前位置失敗:', error);
      Alert.alert('錯誤', '無法獲取當前位置');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // 反向地理編碼（座標轉地址）
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setIsReverseGeocoding(true);
      const results = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results && results.length > 0) {
        const result = results[0];
        const locationData: Location = {
          latitude,
          longitude,
          address: `${result.street || ''} ${result.streetNumber || ''}`.trim(),
          placeName: result.name || result.street || '未知位置',
          city: result.city || result.district || undefined,
          country: result.country || undefined,
        };
        setLocationInfo(locationData);
      }
    } catch (error) {
      console.error('反向地理編碼失敗:', error);
      // 即使失敗也保存座標
      setLocationInfo({
        latitude,
        longitude,
        placeName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      });
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // 搜尋地址
  const searchAddress = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('提示', '請輸入地址');
      return;
    }

    try {
      setIsLoadingLocation(true);
      const results = await ExpoLocation.geocodeAsync(searchQuery);

      if (results && results.length > 0) {
        const result = results[0];
        const newPosition = {
          latitude: result.latitude,
          longitude: result.longitude,
        };

        setMarkerPosition(newPosition);
        setRegion({
          ...newPosition,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        await reverseGeocode(result.latitude, result.longitude);
      } else {
        Alert.alert('找不到位置', '請嘗試其他關鍵字');
      }
    } catch (error) {
      console.error('搜尋地址失敗:', error);
      Alert.alert('搜尋失敗', '無法搜尋該地址');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // 地圖點擊處理
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  // 標記拖動處理
  const handleMarkerDragEnd = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  // 確認選擇
  const handleConfirm = () => {
    if (locationInfo) {
      onLocationSelect(locationInfo);
      onDismiss();
    } else {
      Alert.alert('提示', '請選擇一個位置');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: theme.colors.surface }
        ]}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">選擇位置</Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        {/* 搜尋框 */}
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="搜尋地址或地點..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchAddress}
            style={styles.searchInput}
            right={
              <TextInput.Icon
                icon="magnify"
                onPress={searchAddress}
              />
            }
          />
          <IconButton
            icon="crosshairs-gps"
            mode="contained-tonal"
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          />
        </View>

        {/* 地圖 */}
        <View style={styles.mapContainer}>
          {isLoadingLocation && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {Platform.OS === 'web' ? (
            // Web 平台替代 UI
            <View style={[styles.webFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text variant="titleMedium" style={styles.webFallbackTitle}>
                🗺️ 地圖選擇器
              </Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                地圖功能在網頁版中不可用
              </Text>
              <Text variant="bodySmall" style={{ textAlign: 'center', marginTop: 4, color: theme.colors.onSurfaceVariant }}>
                請在行動裝置上使用此功能
              </Text>
              {locationInfo && (
                <View style={styles.webLocationInfo}>
                  <Text variant="bodyMedium">📍 {locationInfo.placeName}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    座標: {markerPosition.latitude.toFixed(4)}, {markerPosition.longitude.toFixed(4)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            // 移動端 MapView
            MapView && (
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
              >
                {Marker && (
                  <Marker
                    coordinate={markerPosition}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    title={locationInfo?.placeName}
                    description={locationInfo?.address}
                  />
                )}
              </MapView>
            )
          )}
        </View>

        {/* 位置信息 */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
          {isReverseGeocoding ? (
            <View style={styles.geocodingContainer}>
              <ActivityIndicator size="small" />
              <Text variant="bodySmall" style={styles.geocodingText}>
                正在獲取地址...
              </Text>
            </View>
          ) : locationInfo ? (
            <>
              <Text variant="titleMedium">📍 {locationInfo.placeName}</Text>
              {locationInfo.address && (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {locationInfo.address}
                </Text>
              )}
              {locationInfo.city && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {locationInfo.city}{locationInfo.country ? `, ${locationInfo.country}` : ''}
                </Text>
              )}
              <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginTop: 4 }}>
                座標: {locationInfo.latitude.toFixed(6)}, {locationInfo.longitude.toFixed(6)}
              </Text>
            </>
          ) : (
            <Text variant="bodyMedium">點擊地圖選擇位置</Text>
          )}
        </View>

        {/* 按鈕 */}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            取消
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.button}
            disabled={!locationInfo}
          >
            確認
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  infoContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    minHeight: 80,
  },
  geocodingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  geocodingText: {
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 8,
  },
  webFallbackTitle: {
    textAlign: 'center',
  },
  webLocationInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
});
