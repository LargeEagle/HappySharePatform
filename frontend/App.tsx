import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import HomeScreen from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { EditPostScreen } from './src/screens/EditPostScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import { RootStackParamList } from './src/types/navigation';
import { HeaderBar } from './src/components/layout';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "首頁",
                header: (props) => <HeaderBar {...props} title="首頁" />
              }}
            />
            <Stack.Screen
              name="CreatePost"
              component={CreatePostScreen}
              options={{
                title: "發布文章",
                header: (props) => <HeaderBar {...props} title="發布文章" />
              }}
            />
            <Stack.Screen
              name="EditPost"
              component={EditPostScreen}
              options={{
                title: "編輯文章",
                header: (props) => <HeaderBar {...props} title="編輯文章" />
              }}
            />
            <Stack.Screen
              name="PostDetails"
              component={PostDetailScreen}
              options={{
                title: "文章詳情",
                header: (props) => <HeaderBar {...props} title="文章詳情" />
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
