// Updated: 2025-11-01 03:20 - Fixed dual file issue and navigation architecture
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/providers/ThemeProvider";
import { AuthProvider, useAuth } from "./src/hooks/useAuth";
import HomeScreen from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { CreatePostScreen } from "./src/screens/CreatePostScreen";
import { EditPostScreen } from "./src/screens/EditPostScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { SearchScreenTest } from "./src/screens/SearchScreenTest"; // 👈 測試版本
import { SearchScreenMinimal } from "./src/screens/SearchScreenMinimal"; // 👈 最小化版本  
import { TagPostsScreen } from "./src/screens/TagPostsScreen";
import MapSearchScreen from "./src/screens/MapSearchScreen";
import { FollowListScreen } from "./src/screens/FollowListScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { NotificationSettingsScreen } from "./src/screens/NotificationSettingsScreen";
import { RootStackParamList } from "./src/types/navigation";
import { HeaderBar } from "./src/components/layout";

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('Navigation: isAuthenticated =', isAuthenticated, ', isLoading =', isLoading, ', user =', user?.username);

  if (isLoading) {
    console.log('Navigation: Still loading authentication state...');
    return null;
  }

  console.log('Navigation: Rendering screens, initialRoute:', isAuthenticated ? 'Home' : 'Login');

  return (
    <NavigationContainer
      onStateChange={(state) => {
        console.log('Navigation state changed:', state);
      }}
      onReady={() => {
        console.log('Navigation container is ready');
      }}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          animation: 'fade',
        }}
      >
        {/* 認證頁面 - 始終註冊 */}
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
        
        {/* 功能頁面 - 始終註冊，但通過 HeaderBar 控制訪問 */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "首頁",
            header: (props) => <HeaderBar {...props} title="首頁" showBack={false} />,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: "搜尋",
            header: (props) => <HeaderBar {...props} title="搜尋" />,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "個人資料",
            header: (props) => <HeaderBar {...props} title="個人資料" showProfile={false} />,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            title: "編輯資料",
            header: (props) => <HeaderBar {...props} title="編輯資料" showProfile={false} />,
          }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{
            title: "發布文章",
            header: (props) => <HeaderBar {...props} title="發布文章" />,
          }}
        />
        <Stack.Screen
          name="EditPost"
          component={EditPostScreen}
          options={{
            title: "編輯文章",
            header: (props) => <HeaderBar {...props} title="編輯文章" />,
          }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetailScreen}
          options={{
            title: "文章詳情",
            header: (props) => <HeaderBar {...props} title="文章詳情" />,
          }}
        />
        <Stack.Screen
          name="TagPosts"
          component={TagPostsScreen}
          options={{
            title: "標籤",
            header: (props) => <HeaderBar {...props} title="標籤" />,
          }}
        />
        <Stack.Screen
          name="MapSearch"
          component={MapSearchScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FollowList"
          component={FollowListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
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

export default App;
