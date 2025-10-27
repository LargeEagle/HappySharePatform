import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAppTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
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
}

export function HeaderBar({ 
  title, 
  showBack = true, 
  rightAction,
  showThemeToggle = true,
  showProfile = true
}: HeaderBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useAppTheme();
  const { user } = useAuth();

  const handleProfilePress = () => {
    console.log('HeaderBar: Profile button pressed, user:', user?.username);
    const navState = navigation.getState();
    console.log('HeaderBar: Current navigation state:', navState);
    console.log('HeaderBar: Available routes:', navState.routeNames);
    console.log('HeaderBar: Current index:', navState.index);
    try {
      navigation.navigate('Profile', { userId: user?.id });
      console.log('HeaderBar: Navigation to Profile initiated');
    } catch (error) {
      console.error('HeaderBar: Navigation error:', error);
    }
  };

  return (
    <Appbar.Header
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface }
      ]}
    >
      {showBack && (
        <Appbar.BackAction 
          onPress={() => navigation.goBack()} 
        />
      )}
      <Appbar.Content 
        title={title}
        titleStyle={{ color: theme.colors.onSurface }}
      />
      {showThemeToggle && <ThemeToggle />}
      {showProfile && user && (
        <TouchableOpacity onPress={handleProfilePress} style={styles.avatarContainer}>
          <Avatar.Text
            size={36}
            label={user.username.substring(0, 2).toUpperCase()}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
        </TouchableOpacity>
      )}
      {rightAction && (
        <Appbar.Action 
          icon={rightAction.icon} 
          onPress={rightAction.onPress}
        />
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    
  },
});