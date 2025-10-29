import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Chip, Portal, Modal, List, useTheme, Text, Divider } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { TagsList } from '../components/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { usePost } from '../hooks/usePost';
import { tagsService } from '../services';
import type { Tag } from '../types/search';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

export function CreatePostScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const { createPost } = usePost();

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
        tags: selectedTags
      });
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
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    width: '100%',
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
  closeButton: {
    marginTop: 16,
  },
});