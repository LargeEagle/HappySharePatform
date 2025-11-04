import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAppTheme } from '../../providers/ThemeProvider';
import type { Location } from '../../types/post';

// 條件導入 MapView
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

interface MapPreviewProps {
  location: Location;
  onPress?: () => void;
  onRemove?: () => void;
  height?: number;
}

export function MapPreview({ location, onPress, onRemove, height = 150 }: MapPreviewProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        style={[styles.mapContainer, { height }]}
      >
        {Platform.OS === 'web' ? (
          // Web 平台替代 UI
          <View style={[styles.webFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="titleMedium">🗺️</Text>
            <Text variant="bodySmall" style={{ marginTop: 8, textAlign: 'center' }}>
              {location.placeName}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          // 移動端 MapView
          MapView && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {Marker && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={location.placeName}
                />
              )}
            </MapView>
          )
        )}
        {onPress && (
          <View style={styles.overlay}>
            <Text variant="bodySmall" style={styles.overlayText}>
              點擊查看詳細
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={[styles.infoContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.infoContent}>
          <Text variant="bodyMedium" numberOfLines={1}>
            📍 {location.placeName || '未知位置'}
          </Text>
          {location.address && (
            <Text
              variant="bodySmall"
              numberOfLines={1}
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {location.address}
            </Text>
          )}
          {location.city && (
            <Text
              variant="bodySmall"
              numberOfLines={1}
              style={{ color: theme.colors.secondary }}
            >
              {location.city}
            </Text>
          )}
        </View>
        {onRemove && (
          <IconButton
            icon="close-circle"
            size={20}
            onPress={onRemove}
            style={styles.removeButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
  },
  infoContent: {
    flex: 1,
  },
  removeButton: {
    margin: 0,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
