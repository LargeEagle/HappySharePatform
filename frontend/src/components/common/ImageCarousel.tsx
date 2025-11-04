import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { FlatList } from 'react-native';

interface ImageCarouselProps {
  images: string[];
  height?: number;
  onImagePress?: (index: number) => void;
  showIndicator?: boolean;
}

const { width } = Dimensions.get('window');

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 250,
  onImagePress,
  showIndicator = true,
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      activeOpacity={onImagePress ? 0.9 : 1}
      onPress={() => onImagePress?.(index)}
    >
      <Image
        source={{ uri: item }}
        style={[styles.image, { width, height }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* 分頁指示器 */}
      {showIndicator && images.length > 1 && (
        <View style={styles.indicatorContainer}>
          <View
            style={[
              styles.indicator,
              { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#f0f0f0',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  indicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
