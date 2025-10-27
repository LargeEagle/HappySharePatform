import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaLayout } from '../components/layout';
import { Button, TextInput } from '../components/common';
import { useAppTheme } from '../providers/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/user.service';
import { UpdateProfileData } from '../types/auth';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const { user, updateUser } = useAuth();
  
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || '');
      setLocation(user.location || '');
      setWebsite(user.website || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // 驗證
    if (!username.trim()) {
      setError('用戶名稱不能為空');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileData = {
        username: username.trim(),
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
      };

      const updatedUser = await updateUserProfile(user.id, updateData);
      
      // 更新本地用戶狀態
      if (updateUser) {
        updateUser(updatedUser);
      }

      // 返回上一頁
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新資料失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaLayout>
      <ScrollView style={styles.container}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          {/* 頭像區域 */}
          <View style={styles.avatarSection}>
            <Avatar.Text
              size={100}
              label={username.substring(0, 2).toUpperCase() || '??'}
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />
            <IconButton
              icon="camera"
              mode="contained"
              size={20}
              style={styles.cameraButton}
              onPress={() => {
                // TODO: 實現頭像上傳功能
                console.log('Upload avatar');
              }}
            />
          </View>

          {/* 表單 */}
          <View style={styles.form}>
            <TextInput
              label="用戶名稱"
              value={username}
              onChangeText={setUsername}
              placeholder="請輸入用戶名稱"
              error={!username.trim() && !!error}
            />

            <TextInput
              label="個人簡介"
              value={bio}
              onChangeText={setBio}
              placeholder="介紹一下自己吧"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />

            <TextInput
              label="位置"
              value={location}
              onChangeText={setLocation}
              placeholder="例如：台北市"
            />

            <TextInput
              label="網站"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
              autoCapitalize="none"
            />

            {error && (
              <Text variant="bodyMedium" style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                disabled={isLoading}
                style={styles.button}
              >
                取消
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
              >
                儲存
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    marginBottom: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
  },
  form: {
    gap: 16,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    marginTop: -8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
});

export default EditProfileScreen;
