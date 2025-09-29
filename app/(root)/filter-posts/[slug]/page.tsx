"use client";
import React from "react";
import HomeCard from "@/components/HomeCard";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import slugify from "slugify";

const SimilarPostByCategory = ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const posts = useQuery(api.posts.getAllPosts);

  const createSlug = (category: string) => {
    return slugify(category, { lower: true, strict: true });
  };

  const getCategoryFromSlug = (slug: string) => {
    return posts?.find(post => createSlug(post.postCategory) === slug)?.postCategory || slug;
  };

  const originalCategory = getCategoryFromSlug(params.slug);

  const filteredPosts = posts?.filter(
    (post) => createSlug(post.postCategory) === params.slug
  );

  if (!filteredPosts) return <LoaderSpinner />;

  return (
    <section className="flex flex-col gap-5 ml-[4rem] mt-[9rem] max-md:ml-[0]">
      <h1 className="text-[1.8rem] font-bold text-gray-200 max-sm:text-[1.3rem]">Posts in {originalCategory}</h1>
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="">
          {filteredPosts?.map(
            ({
              _id: postId,
              views,
              likes,
              postCategory,
              postTitle,
              postDescription,
              postContent,
              authorImageUrl,
              imageUrl,
              author,
              _creationTime
            }) => {
              return (
                <HomeCard
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
            title={`No Similar posts found in ${originalCategory}`}
            buttonLink="/dashboard"
            buttonText="Discover more Posts"
          />
        </>
      )}
    </section>
  );
};

export default SimilarPostByCategory;