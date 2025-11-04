export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: { userId?: string };
  EditProfile: undefined;
  CreatePost: undefined;
  PostDetails: { postId: string };
  PostDetail: { postId: string }; // 別名
  EditPost: { postId: string };
  Search: undefined;
  TagPosts: { slug: string };
  MapSearch: undefined;
  FollowList: { userId: string; initialTab?: 'followers' | 'following' | 'mutual' };
  Notifications: undefined; // 新增：通知列表
  NotificationSettings: undefined; // 新增：通知設定
};