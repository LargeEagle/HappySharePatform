import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, ActivityIndicator, Chip, Portal, Modal, Button as PaperButton, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { Button, TextInput, Card } from '../components/common';
import { usePost } from '../hooks/usePost';
import { usePostManagement } from '../hooks/usePostManagement';
import { tagsService } from '../services';
import { RootStackParamList } from '../types/navigation';
import { updateDevDocs } from '../utils/devDocs';
import type { Tag } from '../types/search';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

export function EditPostScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const { post, isLoading: isLoadingPost, error: loadError } = usePost(postId);
  const { updatePost, isLoading: isUpdating } = usePostManagement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      // 支持新舊格式
      if (post.postTags) {
        setSelectedTags(post.postTags.map(pt => pt.tag.name));
      } else if (post.tags) {
        setSelectedTags(post.tags);
      }
    }
  }, [post]);

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

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('錯誤', '標題和內容不能為空');
      return;
    }

    const result = await updatePost(postId, {
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags
    });

    if (result) {
      updateDevDocs({
        type: 'feature',
        title: '文章編輯功能使用',
        details: [
          `文章 "${title}" 已成功更新`,
          '文章內容已儲存',
          '返回文章詳情頁'
        ]
      });

      Alert.alert('成功', '文章已更新', [
        {
          text: '確定',
          onPress: () => navigation.goBack()
        }
      ]);
    }
  };

  if (isLoadingPost) {
    return (
      <SafeAreaLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>載入文章中...</Text>
        </View>
      </SafeAreaLayout>
    );
  }

  if (loadError || !post) {
    return (
      <SafeAreaLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>載入文章失敗</Text>
          <Button onPress={() => navigation.goBack()} mode="outlined">
            返回
          </Button>
        </View>
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <TextInput
            label="文章標題"
            value={title}
            onChangeText={setTitle}
            placeholder="輸入文章標題"
            disabled={isUpdating}
          />
          <TextInput
            label="文章內容"
            value={content}
            onChangeText={setContent}
            placeholder="分享你的快樂時刻..."
            multiline
            numberOfLines={10}
            style={styles.contentInput}
            disabled={isUpdating}
          />
          
          {/* 標籤選擇 */}
          <View style={styles.tagsContainer}>
            <PaperButton
              mode="outlined"
              onPress={() => setShowTagSelector(true)}
              disabled={isUpdating}
              style={styles.addTagButton}
            >
              選擇標籤 ({selectedTags.length}/5)
            </PaperButton>
            
            <View style={styles.selectedTags}>
              {selectedTags.map(tag => (
                <Chip
                  key={tag}
                  onClose={() => handleAddTag(tag)}
                  style={styles.tag}
                  disabled={isUpdating}
                >
                  #{tag}
                </Chip>
              ))}
            </View>
          </View>

          <Button
            onPress={handleUpdate}
            loading={isUpdating}
            disabled={isUpdating}
            style={styles.button}
          >
            更新文章
          </Button>
          <Button
            onPress={() => navigation.goBack()}
            mode="outlined"
            disabled={isUpdating}
            style={styles.button}
          >
            取消
          </Button>
        </Card>
      </ScrollView>

      {/* 標籤選擇器模態框 */}
      <Portal>
        <Modal
          visible={showTagSelector}
          onDismiss={() => setShowTagSelector(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView style={styles.modalContent}>
            {/* 自定義標籤輸入 */}
            <View style={styles.customTagSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                自定義標籤
              </Text>
              <View style={styles.customTagInput}>
                <TextInput
                  label="輸入標籤名稱"
                  value={customTag}
                  onChangeText={setCustomTag}
                  placeholder="例如：旅行、美食"
                  style={styles.customTagField}
                />
                <PaperButton
                  mode="contained"
                  onPress={handleAddCustomTag}
                  disabled={!customTag.trim()}
                  style={styles.addButton}
                >
                  添加
                </PaperButton>
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

            <PaperButton
              mode="text"
              onPress={() => setShowTagSelector(false)}
              style={styles.closeButton}
            >
              完成
            </PaperButton>
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    marginBottom: 16
  },
  contentInput: {
    minHeight: 200
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
    gap: 8,
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  button: {
    marginTop: 8
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 16,
    color: 'red'
  },
  modal: {
    margin: 20,
    maxHeight: '80%',
    borderRadius: 12,
    backgroundColor: 'white',
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
    alignItems: 'flex-start',
  },
  customTagField: {
    flex: 1,
  },
  addButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  popularTagsSection: {
    marginBottom: 16,
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
