import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { Button, TextInput, Card } from '../components/common';
import { usePost } from '../hooks/usePost';
import { usePostManagement } from '../hooks/usePostManagement';
import { RootStackParamList } from '../types/navigation';
import { updateDevDocs } from '../utils/devDocs';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

export function EditPostScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const { post, isLoading: isLoadingPost, error: loadError } = usePost(postId);
  const { updatePost, isLoading: isUpdating } = usePostManagement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags?.join(', ') || '');
    }
  }, [post]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('錯誤', '標題和內容不能為空');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const result = await updatePost(postId, {
      title: title.trim(),
      content: content.trim(),
      tags: tagsArray
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
          <TextInput
            label="標籤（用逗號分隔）"
            value={tags}
            onChangeText={setTags}
            placeholder="例如：快樂, 分享, 生活"
            disabled={isUpdating}
          />
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
  button: {
    marginTop: 8
  },
  loadingText: {
    marginTop: 16
  },
  errorText: {
    marginBottom: 16,
    color: 'red'
  }
});
