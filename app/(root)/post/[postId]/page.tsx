"use client";

// import PostDetailPlayer from "@/components/PostDetailPlayer";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import PostCard from "@/components/PostCard";
import { useUser } from "@clerk/nextjs";


const PostDetails = ({
    params: { postId },
  }: {
    params: { postId: Id<"posts"> };
  }) => {
  const { user } = useUser();


  const post = useQuery(api.posts.getPostById, {
     postId: postId
  });

  const similarPosts = useQuery(api.posts.getPostByPostCategory, {
    postId: postId
});

//   const isOwner = user?.id === post?.authorId;

  if (!similarPosts || !post) return <LoaderSpinner></LoaderSpinner>;

    if (!postId) {
      return <LoaderSpinner />;
    }

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          {/* <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          ></Image> */}
          <h2 className="text-16 font-bold text-white-1">{post?.views}</h2>
        </figure>
      </header>
      {/* <PostDetailPlayer isOwner={isOwner} 
      postid={post._id}
      {...post}
      ></PostDetailPlayer> */}
      <p className="text-16 pb-8 pt-[45px] font-medium text-white-2 max-md:text-center">
        {post?.postDescription}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {post?.postContent}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
          <p className="text-16 font-medium text-white-2">
            {post?.imagePrompt}
          </p>
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Posts</h1>
        {similarPosts && similarPosts.length > 0 ? (
          <div className="">
            {similarPosts?.map(
              ({
                postId,
                views,
                postCategory,
                postTitle,
                postDescription,
                postContent,
                authorImageUrl,
                imageUrl,
                author,
                _creationTime,
              }) => {
                return (
                  <PostCard
                    key={postId}
                    imageUrl={imageUrl!}
                    title={postTitle!}
                    description={postDescription}
                    category={postCategory}
                    content={postContent}
                    postId={postId}
                    views={views}
                    author={author}
                    authorImageUrl={authorImageUrl}
                    _creationTime={_creationTime}
                  />
                );
              }
            )}
          </div>
        ) : (
          <>
            <EmptyStates
              title="No Similar post Found"
              buttonLink="/discover"
              buttonText="Discover more posts"
            ></EmptyStates>
          </>
        )}
      </section>
    </section>
  );
};

export default PostDetails;
