export type UserType = {
  _id: string;
  name: string;
  email: string;
  token: string;
};

export type LikeType = {
  _id: string;
  photo: string;
  comment: string;
  user: UserType;
};

export type CommentType = {
  _id: string;
  message: string;
  photo: PhotoType;
  user: UserType;
  reply: CommentType[];
  likes: LikeType[];
};

export type PhotoType = {
  _id: string;
  imageUrl: string;
  caption: string;
  user: UserType;
  likes: LikeType[];
  comment: CommentType[];
  created_at: string;
};

export type PhotosType = {
  data: PhotoType[];
  total: number;
};
