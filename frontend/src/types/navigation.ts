export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: { userId?: string };
  EditProfile: undefined;
  CreatePost: undefined;
  PostDetails: { postId: string };
  EditPost: { postId: string };
};