export class CreatePostDto {
  title: string;
  content: string;
  image?: string;
  isPublished?: boolean;
}

export class UpdatePostDto {
  title?: string;
  content?: string;
  image?: string;
  isPublished?: boolean;
}

export class PostQueryDto {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'popular';
}
