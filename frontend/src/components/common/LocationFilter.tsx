import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Portal, Modal, Text, Switch, ActivityIndicator, Surface, SegmentedButtons } from 'react-native-paper';
import * as ExpoLocation from 'expo-location';
import type { Location } from '../../types/post';

interface LocationFilterProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (location: Location | null, radiusKm: number) => void;
  currentLocation?: Location | null;
  currentRadius?: number;
}

export function LocationFilter({
  visible,
  onDismiss,
  onApply,
  currentLocation,
  currentRadius = 10,
}: LocationFilterProps) {
  const [enabled, setEnabled] = useState(!!currentLocation);
  const [location, setLocation] = useState<Location | null>(currentLocation || null);
  const [radiusKm, setRadiusKm] = useState(currentRadius);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      // 請求權限
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('需要位置權限才能使用此功能');
        return;
      }

      // 獲取當前位置
      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      // 反向地理編碼獲取地址
      const addresses = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const address = addresses[0];
      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: address ? `${address.street || ''} ${address.name || ''}`.trim() : undefined,
        city: address?.city || undefined,
        country: address?.country || undefined,
        accuracy: position.coords.accuracy || undefined,
      };

      setLocation(newLocation);
      setEnabled(true);
    } catch (error) {
      console.error('獲取位置失敗:', error);
      alert('獲取位置失敗，請重試');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleApply = () => {
    if (enabled && location) {
      onApply(location, radiusKm);
    } else {
      onApply(null, radiusKm);
    }
    onDismiss();
  };

  const handleReset = () => {
    setEnabled(false);
    setLocation(null);
    setRadiusKm(10);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Surface style={styles.container}>
          <Text variant="titleLarge" style={styles.title}>
            📍 位置篩選
          </Text>

          {/* 開啟/關閉位置篩選 */}
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">啟用位置篩選</Text>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>

          {enabled && (
            <>
              {/* 當前位置狀態 */}
              <Surface style={styles.locationStatus}>
                {location ? (
                  <>
                    <Text variant="bodyMedium" style={styles.locationText}>
                      ✓ 當前位置
                    </Text>
                    {location.city && (
                      <Text variant="bodySmall" style={styles.locationDetail}>
                        {location.city}
                      </Text>
                    )}
                    {location.address && (
                      <Text variant="bodySmall" style={styles.locationDetail}>
                        {location.address}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text variant="bodyMedium" style={styles.noLocationText}>
                    尚未設定位置
                  </Text>
                )}
              </Surface>

              {/* 獲取當前位置按鈕 */}
              <Button
                mode="outlined"
                icon="crosshairs-gps"
                onPress={handleGetCurrentLocation}
                disabled={isGettingLocation}
                style={styles.gpsButton}
              >
                {isGettingLocation ? '正在獲取位置...' : '使用我的當前位置'}
              </Button>

              {isGettingLocation && (
                <ActivityIndicator size="small" style={styles.loader} />
              )}

              {/* 搜尋半徑選擇 */}
              {location && (
                <View style={styles.radiusSection}>
                  <View style={styles.radiusHeader}>
                    <Text variant="bodyLarge">搜尋半徑</Text>
                    <Text variant="bodyLarge" style={styles.radiusValue}>
                      {radiusKm} km
                    </Text>
                  </View>
                  
                  <SegmentedButtons
                    value={String(radiusKm)}
                    onValueChange={(value) => setRadiusKm(Number(value))}
                    buttons={[
                      { value: '1', label: '1km' },
                      { value: '5', label: '5km' },
                      { value: '10', label: '10km' },
                      { value: '20', label: '20km' },
                      { value: '50', label: '50km' },
                    ]}
                    style={styles.segmentedButtons}
                  />
                </View>
              )}
            </>
          )}

          {/* 操作按鈕 */}
          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleReset} style={styles.actionButton}>
              重置
            </Button>
            <Button mode="outlined" onPress={onDismiss} style={styles.actionButton}>
              取消
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.actionButton}
              disabled={enabled && !location}
            >
              套用
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
  },
  container: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    marginBottom: 20,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationStatus: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  locationText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  locationDetail: {
    color: '#666',
    marginTop: 2,
  },
  noLocationText: {
    color: '#999',
    fontStyle: 'italic',
  },
  gpsButton: {
    marginBottom: 12,
  },
  loader: {
    marginVertical: 8,
  },
  radiusSection: {
    marginTop: 16,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radiusValue: {
    fontWeight: '600',
    color: '#007AFF',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  radiusLabel: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});
