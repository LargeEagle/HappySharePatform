// HAPPY SHARE - 服務導出

export { apiClient } from './api.client';
export { authService } from './auth.service';
export { postsService } from './posts.service';
export { postInteractionService } from './postInteraction.service';
export { searchService } from './search.service';
export { tagsService } from './tags.service';

// 用戶服務（個別函數導出）
export {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  uploadAvatar,
} from './user.service';
