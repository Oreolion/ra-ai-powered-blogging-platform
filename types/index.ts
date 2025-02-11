/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "../convex/_generated/dataModel";

export interface PostProps {
  _id: Id<"posts">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  postTitle: string;
  postDescription: string;
  postContent: string;
  postCategory: string;
  audioUrl: string | null;
  imageUrl: string | null;
  summary: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  imagePrompt: string | null;
  audioDuration: number;
  views: number;
  //   viewedBy: string[];
  likes: number;
}

export interface PostCommentType {
  content: string;
  newContent: string;
  _id: string;
  _creationTime: number;
  editedAt: number;
  postId: string;
  userId: string;
  username: string;
  commentUserImage: string;
}

export type PostCommentsArrayType = PostCommentType[];

export interface ProfilePostProps {
  posts: PostProps[];
  listeners: number;
}

export type postCategory =
  | "Technology"
  | "Metaphysics & Esoterics"
  | "Science"
  | "World News"
  | "Africa"
  | "Politics"
  | "Programming"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "Economics & Finance"
  | "Self Development"
  | "Others";

export interface GeneratePostProps {
  postCategory: postCategory;
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
}

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface PostCardProps {
  imageUrl: string;
  title: string;
  content: string;
  category: string;
  author: string;
  _creationTime: number;
  views: number;
  likes: number;
  authorImageUrl?: string;
  description: string;
  postId: Id<"posts">;
  authorId: string;
  imageStorageId: string;
  audioStorageId: string | null;
}

export interface ProfilePostProps {
  posts: PostProps[];
  listeners: number;
}

export interface ProfileCardProps {
  postData: ProfilePostProps;
  imageUrl: string;
  userFirstName: string;
}
