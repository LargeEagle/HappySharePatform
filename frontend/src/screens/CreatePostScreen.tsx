import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Chip, Portal, Modal, List, useTheme } from 'react-native-paper';
import { SafeAreaLayout } from '../components/layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { usePost } from '../hooks/usePost';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const PREDEFINED_TAGS = [
  '日常', '美食', '旅遊', '音樂', '電影',
  '運動', '寵物', '攝影', '藝術', '科技',
  '閱讀', '心情', '學習', '工作', '生活'
];

export function CreatePostScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost } = usePost();

  const handleAddTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(tags => tags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags(tags => [...tags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags
      });
      navigation.navigate('Home');
    } catch (error) {
      // TODO: 顯示錯誤訊息
      console.error('發布文章失敗:', error);
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
            <List.Section title="選擇標籤（最多5個）">
              {PREDEFINED_TAGS.map(tag => (
                <List.Item
                  key={tag}
                  title={tag}
                  onPress={() => handleAddTag(tag)}
                  right={props =>
                    selectedTags.includes(tag) ? (
                      <List.Icon {...props} icon="check" />
                    ) : null
                  }
                />
              ))}
            </List.Section>
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
    padding: 20,
    borderRadius: 8,
  },
});