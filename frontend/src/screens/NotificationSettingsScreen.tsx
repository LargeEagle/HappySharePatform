import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, List, Switch, Divider, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

/**
 * 通知設定畫面
 */
export const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { settings, isLoading, isSaving, toggleSetting } = useNotificationSettings();

  if (isLoading || !settings) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="通知設定" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <Text>載入中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 標題欄 */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="通知設定" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* 主開關 */}
        <List.Section>
          <List.Subheader>通知總開關</List.Subheader>
          <List.Item
            title="啟用通知"
            description="開啟或關閉所有通知"
            right={() => (
              <Switch
                value={settings.enabled}
                onValueChange={() => toggleSetting('enabled')}
                disabled={isSaving}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* 通知類型 */}
        <List.Section>
          <List.Subheader>通知類型</List.Subheader>
          
          <List.Item
            title="關注通知"
            description="當有人關注你時通知"
            left={props => <List.Icon {...props} icon="account-plus" />}
            right={() => (
              <Switch
                value={settings.follow}
                onValueChange={() => toggleSetting('follow')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="讚通知"
            description="當有人讚你的文章時通知"
            left={props => <List.Icon {...props} icon="heart" />}
            right={() => (
              <Switch
                value={settings.like}
                onValueChange={() => toggleSetting('like')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="評論通知"
            description="當有人評論你的文章時通知"
            left={props => <List.Icon {...props} icon="comment" />}
            right={() => (
              <Switch
                value={settings.comment}
                onValueChange={() => toggleSetting('comment')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="回覆通知"
            description="當有人回覆你的評論時通知"
            left={props => <List.Icon {...props} icon="reply" />}
            right={() => (
              <Switch
                value={settings.reply}
                onValueChange={() => toggleSetting('reply')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="提及通知"
            description="當有人提及你時通知"
            left={props => <List.Icon {...props} icon="at" />}
            right={() => (
              <Switch
                value={settings.mention}
                onValueChange={() => toggleSetting('mention')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="系統通知"
            description="接收系統公告和更新"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.system}
                onValueChange={() => toggleSetting('system')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* 通知方式 */}
        <List.Section>
          <List.Subheader>通知方式</List.Subheader>
          
          <List.Item
            title="聲音"
            description="通知時播放聲音"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.sound}
                onValueChange={() => toggleSetting('sound')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />

          <List.Item
            title="震動"
            description="通知時震動"
            left={props => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={settings.vibrate}
                onValueChange={() => toggleSetting('vibrate')}
                disabled={!settings.enabled || isSaving}
              />
            )}
          />
        </List.Section>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpace: {
    height: 32,
  },
});
