import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Chip, Portal, Modal, List, useTheme, Text, Divider, IconButton } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { TagsList, LocationPicker, MapPreview, ImageGallery, ImageViewer } from '../components/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCreatePost } from '../hooks/useCreatePost';
import { tagsService } from '../services';
import type { Tag } from '../types/search';
import type { Location } from '../types/post';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const DRAFT_KEY = '@post_draft';

export function CreatePostScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const { createPost } = useCreatePost();

  // 載入草稿
  useEffect(() => {
    loadDraft();
  }, []);

  // 載入草稿
  const loadDraft = async () => {
    try {
      const draftJson = await AsyncStorage.getItem(DRAFT_KEY);
      if (draftJson) {
        const draft = JSON.parse(draftJson);
        setTitle(draft.title || '');
        setContent(draft.content || '');
        setSelectedTags(draft.tags || []);
        setSelectedImages(draft.images || []);
        setSelectedLocation(draft.location || null);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    try {
      const draft = {
        title,
        content,
        tags: selectedTags,
        images: selectedImages,
        location: selectedLocation,
        savedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      Alert.alert('成功', '草稿已保存');
    } catch (error) {
      console.error('Failed to save draft:', error);
      Alert.alert('錯誤', '保存草稿失敗');
    }
  };

  // 清除草稿
  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  // 處理圖片查看
  const handleImagePress = (index: number) => {
    setImageViewerIndex(index);
    setShowImageViewer(true);
  };

  // 載入熱門標籤
  useEffect(() => {
    loadPopularTags();
  }, []);

  const loadPopularTags = async () => {
    try {
      setIsLoadingTags(true);
      const tags = await tagsService.getPopularTags(15);
      setPopularTags(tags);
    } catch (error) {
      console.error('Failed to load popular tags:', error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleAddTag = (tagName: string) => {
    const normalizedTag = tagName.trim();
    if (!normalizedTag) return;

    if (selectedTags.includes(normalizedTag)) {
      setSelectedTags(tags => tags.filter(t => t !== normalizedTag));
    } else if (selectedTags.length < 5) {
      setSelectedTags(tags => [...tags, normalizedTag]);
    } else {
      Alert.alert('提示', '最多只能選擇 5 個標籤');
    }
  };

  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    
    if (customTag.trim().length < 2) {
      Alert.alert('提示', '標籤名稱至少需要 2 個字符');
      return;
    }

    if (customTag.trim().length > 20) {
      Alert.alert('提示', '標籤名稱不能超過 20 個字符');
      return;
    }

    handleAddTag(customTag.trim());
    setCustomTag('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('提示', '請填寫標題和內容');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
        images: selectedImages,
        location: selectedLocation || undefined // 添加位置信息
      });
      
      // 成功後清除草稿
      await clearDraft();
      
      Alert.alert('成功', '文章已發布', [
        { text: '確定', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('發布文章失敗:', error);
      Alert.alert('錯誤', '發布文章失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.content}>
          <TextInput
            mode="outlined"
            label="標題"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            style={styles.titleInput}
          />

          <TextInput
            mode="outlined"
            label="分享你的快樂時刻..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={10}
            style={styles.contentInput}
          />

          {/* 圖片選擇區域 */}
          <View style={styles.imageSection}>
            <Text variant="titleSmall" style={{ marginBottom: 8 }}>
              📸 圖片
            </Text>
            <ImageGallery
              images={selectedImages}
              onImagesChange={setSelectedImages}
              maxImages={9}
              editable={true}
              onImagePress={handleImagePress}
            />
          </View>

          {/* 位置選擇區域 */}
          <View style={styles.locationSection}>
            <Button
              mode="outlined"
              icon={selectedLocation ? "map-marker-check" : "map-marker-plus"}
              onPress={() => setShowLocationPicker(true)}
              style={styles.locationButton}
            >
              {selectedLocation ? '✓ 已添加位置' : '📍 添加位置'}
            </Button>

            {selectedLocation && (
              <MapPreview
                location={selectedLocation}
                height={150}
                onPress={() => setShowLocationPicker(true)}
                onRemove={() => setSelectedLocation(null)}
              />
            )}
          </View>

          <View style={styles.tagsContainer}>
            <Button
              mode="outlined"
              onPress={() => setShowTagSelector(true)}
              style={styles.addTagButton}
            >
              添加標籤 ({selectedTags.length}/5)
            </Button>
            
            <View style={styles.selectedTags}>
              {selectedTags.map(tag => (
                <Chip
                  key={tag}
                  onClose={() => handleAddTag(tag)}
                  style={styles.tag}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.surfaceVariant }]}>
          <Button
            mode="outlined"
            onPress={saveDraft}
            disabled={isSubmitting}
            style={styles.draftButton}
          >
            保存草稿
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!title.trim() || !content.trim() || isSubmitting}
            style={styles.submitButton}
          >
            發布
          </Button>
        </View>

        <Portal>
          <Modal
            visible={showTagSelector}
            onDismiss={() => setShowTagSelector(false)}
            contentContainerStyle={[
              styles.modal,
              { backgroundColor: colors.surface }
            ]}
          >
            <ScrollView style={styles.modalContent}>
              {/* 自定義標籤輸入 */}
              <View style={styles.customTagSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  自定義標籤
                </Text>
                <View style={styles.customTagInput}>
                  <TextInput
                    mode="outlined"
                    label="輸入標籤名稱"
                    value={customTag}
                    onChangeText={setCustomTag}
                    maxLength={20}
                    placeholder="例如：旅行、美食"
                    style={styles.customTagField}
                    onSubmitEditing={handleAddCustomTag}
                  />
                  <Button
                    mode="contained"
                    onPress={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    style={styles.addButton}
                  >
                    添加
                  </Button>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* 熱門標籤 */}
              <View style={styles.popularTagsSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  熱門標籤（最多選擇 5 個）
                </Text>
                {isLoadingTags ? (
                  <Text style={styles.loadingText}>載入中...</Text>
                ) : (
                  <View style={styles.tagsGrid}>
                    {popularTags.map((tag) => (
                      <Chip
                        key={tag.id}
                        selected={selectedTags.includes(tag.name)}
                        onPress={() => handleAddTag(tag.name)}
                        style={[
                          styles.popularTag,
                          selectedTags.includes(tag.name) && styles.selectedPopularTag
                        ]}
                      >
                        #{tag.name} ({tag.postsCount})
                      </Chip>
                    ))}
                  </View>
                )}
              </View>

              <Button
                mode="text"
                onPress={() => setShowTagSelector(false)}
                style={styles.closeButton}
              >
                完成
              </Button>
            </ScrollView>
          </Modal>

          {/* 位置選擇器模態框 */}
          <LocationPicker
            visible={showLocationPicker}
            onDismiss={() => setShowLocationPicker(false)}
            onLocationSelect={(location) => {
              setSelectedLocation(location);
              setShowLocationPicker(false);
            }}
            initialLocation={selectedLocation || undefined}
          />

          {/* 圖片查看器 */}
          <ImageViewer
            images={selectedImages}
            initialIndex={imageViewerIndex}
            visible={showImageViewer}
            onClose={() => setShowImageViewer(false)}
          />
        </Portal>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    marginBottom: 16,
    minHeight: 200,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageButton: {
    marginBottom: 12,
  },
  imagesPreview: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  addTagButton: {
    marginBottom: 8,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    margin: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  draftButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  modal: {
    margin: 20,
    maxHeight: '80%',
    borderRadius: 12,
  },
  modalContent: {
    padding: 20,
  },
  customTagSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  customTagInput: {
    flexDirection: 'row',
    gap: 8,
  },
  customTagField: {
    flex: 1,
  },
  addButton: {
    justifyContent: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  popularTagsSection: {
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    marginBottom: 8,
  },
  selectedPopularTag: {
    backgroundColor: '#007AFF20',
  },
  locationSection: {
    marginBottom: 16,
  },
  locationButton: {
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 16,
  },
});