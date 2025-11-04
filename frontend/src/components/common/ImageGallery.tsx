import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface ImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  editable?: boolean;
  onImagePress?: (index: number) => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3; // 3 columns with padding

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagesChange,
  maxImages = 9,
  editable = true,
  onImagePress,
}) => {
  const theme = useTheme();

  // 選擇圖片
  const pickImages = async () => {
    try {
      if (images.length >= maxImages) {
        Alert.alert('提示', `最多只能上傳 ${maxImages} 張圖片`);
        return;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('提示', '需要訪問相冊的權限才能選擇圖片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Failed to pick images:', error);
      Alert.alert('錯誤', '選擇圖片失敗');
    }
  };

  // 拍照
  const takePhoto = async () => {
    try {
      if (images.length >= maxImages) {
        Alert.alert('提示', `最多只能上傳 ${maxImages} 張圖片`);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('提示', '需要相機權限才能拍照');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        onImagesChange([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('錯誤', '拍照失敗');
    }
  };

  // 刪除圖片
  const removeImage = (index: number) => {
    if (!editable) return;
    
    Alert.alert(
      '確認刪除',
      '確定要刪除這張圖片嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            onImagesChange(newImages);
          },
        },
      ]
    );
  };

  // 顯示選項對話框
  const showImageOptions = () => {
    Alert.alert(
      '添加圖片',
      '請選擇圖片來源',
      [
        {
          text: '相簿',
          onPress: pickImages,
        },
        {
          text: '相機',
          onPress: takePhoto,
        },
        {
          text: '取消',
          style: 'cancel',
        },
      ]
    );
  };

  const handleImagePress = (index: number) => {
    if (onImagePress) {
      onImagePress(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* 圖片數量提示 */}
      {images.length > 0 && (
        <View style={styles.header}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            已選擇 {images.length}/{maxImages} 張圖片
          </Text>
        </View>
      )}

      {/* 圖片網格 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 已選擇的圖片 */}
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri }}
                style={[
                  styles.image,
                  { borderColor: theme.colors.outline },
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* 刪除按鈕 */}
            {editable && (
              <IconButton
                icon="close-circle"
                iconColor={theme.colors.error}
                size={24}
                style={styles.deleteButton}
                onPress={() => removeImage(index)}
              />
            )}

            {/* 圖片順序標記 */}
            <View
              style={[
                styles.indexBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
              >
                {index + 1}
              </Text>
            </View>
          </View>
        ))}

        {/* 添加圖片按鈕 */}
        {editable && images.length < maxImages && (
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
            onPress={showImageOptions}
          >
            <IconButton
              icon="plus"
              iconColor={theme.colors.onSurfaceVariant}
              size={32}
            />
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              添加圖片
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 提示文字 */}
      {editable && images.length === 0 && (
        <View style={styles.emptyHint}>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
          >
            點擊上方按鈕添加圖片{'\n'}最多可添加 {maxImages} 張
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  indexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  addButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHint: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
});
