export class UpdateUserDto {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  createdAt: Date;
}
