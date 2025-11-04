import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeToggle } from '../common/ThemeToggle';
import { NotificationBadge } from '../common/NotificationBadge';
import { useAppTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationBadge } from '../../hooks/useNotificationBadge';
import { RootStackParamList } from '../../types/navigation';

export interface HeaderBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  showThemeToggle?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function HeaderBar({ 
  title, 
  showBack = true, 
  rightAction,
  showThemeToggle = true,
  showProfile = true,
  showSearch = true,
  showNotifications = true,
}: HeaderBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useAppTheme();
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotificationBadge();

  const handleProfilePress = () => {
    if (!isAuthenticated) {
      console.log('HeaderBar: User not authenticated, redirecting to Login');
      navigation.navigate('Login');
      return;
    }
    console.log('HeaderBar: Profile button pressed, user:', user?.username);
    try {
      navigation.navigate('Profile', { userId: user?.id });
      console.log('HeaderBar: Navigation to Profile initiated');
    } catch (error) {
      console.error('HeaderBar: Navigation error:', error);
    }
  };

  const handleSearchPress = () => {
    console.log('HeaderBar: Search button clicked!', { isAuthenticated, user: user?.username });
    if (!isAuthenticated) {
      console.log('HeaderBar: User not authenticated, redirecting to Login');
      navigation.navigate('Login');
      return;
    }
    console.log('HeaderBar: Attempting to navigate to Search screen...');
    try {
      navigation.navigate('Search');
      console.log('HeaderBar: Navigation to Search initiated');
    } catch (error) {
      console.error('HeaderBar: Search navigation error:', error);
    }
  };

  const handleNotificationsPress = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Notifications');
  };

  return (
    <Appbar.Header
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface }
      ]}
    >
      {showBack ? (
        <Appbar.BackAction 
          onPress={() => navigation.goBack()} 
        />
      ) : null}
      <Appbar.Content 
        title={title}
        titleStyle={{ color: theme.colors.onSurface }}
      />
      {/* 只在已認證時顯示搜索按鈕 - 使用 IconButton 替代 Appbar.Action */}
      {showSearch && isAuthenticated ? (
        <IconButton
          icon="magnify"
          size={24}
          iconColor={theme.colors.onSurface}
          onPress={handleSearchPress}
          style={{ margin: 0 }}
        />
      ) : null}
      {/* 通知圖標 */}
      {showNotifications && isAuthenticated ? (
        <TouchableOpacity onPress={handleNotificationsPress} style={styles.notificationContainer}>
          <NotificationBadge count={unreadCount} />
        </TouchableOpacity>
      ) : null}
      {showThemeToggle ? <ThemeToggle /> : null}
      {/* 只在已認證時顯示個人資料按鈕 */}
      {showProfile && isAuthenticated && user ? (
        <TouchableOpacity onPress={handleProfilePress} style={styles.avatarContainer}>
          <Avatar.Text
            size={36}
            label={user.username.substring(0, 2).toUpperCase()}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
        </TouchableOpacity>
      ) : null}
      {rightAction ? (
        <Appbar.Action 
          icon={rightAction.icon} 
          onPress={rightAction.onPress}
        />
      ) : null}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  notificationContainer: {
    marginHorizontal: 8,
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    
  },
});