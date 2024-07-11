/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "../convex/_generated/dataModel";

export interface PostProps {
  _id: Id<"posts">;
//   profileId: Id<"posts">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  postTitle: string;
  postDescription: string;
  postContent: string;
  postCategory: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  imagePrompt: string | null;
  audioDuration: number;
  views: number;
}

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
  | "Programming"
  | "Machine Learning"
  | "Artificial Intelligence";

export interface GeneratePostProps {
  postCategory: postCategory;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
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
  authorImageUrl: string;
  description: string;
  postId: Id<"posts">;
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
