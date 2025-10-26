export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  CreatePost: undefined;
  PostDetails: { postId: string };
  EditPost: { postId: string };
};