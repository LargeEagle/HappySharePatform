import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { FlatList } from 'react-native';

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = React.useRef<FlatList>(null);

  // 當 visible 變化時，重置 index
  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      // 延遲滾動到初始位置，確保 FlatList 已渲染
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'black' }]}>
        {/* 隱藏狀態列（iOS） */}
        <StatusBar hidden />

        {/* 頂部工具欄 */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingTop: Platform.OS === 'ios' ? 50 : 20,
            },
          ]}
        >
          <IconButton
            icon="close"
            iconColor="white"
            size={28}
            onPress={onClose}
          />
          <Text variant="titleMedium" style={styles.headerText}>
            {currentIndex + 1} / {images.length}
          </Text>
          <View style={{ width: 48 }} />
        </View>

        {/* 圖片輪播 */}
        <FlatList
          ref={flatListRef}
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
          initialScrollIndex={initialIndex}
          onScrollToIndexFailed={(info) => {
            // 處理滾動失敗，重試
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }, 100);
          }}
        />

        {/* 底部分頁指示器 */}
        <View style={[styles.footer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : 'rgba(255, 255, 255, 0.5)',
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    zIndex: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
