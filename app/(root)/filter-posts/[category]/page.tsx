"use client";
import React from "react";
import PostCard from "@/components/PostCard";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SimilarPostByCategory = ({
  params,
}: {
  params: {
    category: string;
  };
}) => {
  const posts = useQuery(api.posts.getAllPosts);

  const filteredPosts = posts?.filter(
    (post) => post.postCategory === params.category
  );

  if (!filteredPosts) return <LoaderSpinner />;

  return (
    <section className=" flex flex-col gap-5 ml-[18rem] mt-[9rem] max-md:ml-[0]">
      <h1 className="text-[1.8rem] font-bold text-white-1">Similar Posts</h1>
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="">
          {filteredPosts?.map(
            ({
              postId,
              views,
              likes,
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
                  likes={likes}
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
            buttonLink="/dashboard"
            buttonText="Discover more Posts"
          ></EmptyStates>
        </>
      )}
    </section>
  );
};

export default SimilarPostByCategory;
