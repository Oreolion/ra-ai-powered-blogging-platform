"use client";
import styles from "@/styles/homefeeds.module.css";

import LoaderSpinner from "@/components/LoaderSpinner";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeCard from "@/components/HomeCard";
import SearchBar from "@/components/SearchBar";

const SavedPosts = () => {
  const { user } = useUser();
  const allSavedPosts = useQuery(api.posts.getAllSavedPosts);
  const getUserById = useQuery(api.users.getUserById, {
    clerkId: user?.id,
  });

  // Handle loading state
  if (allSavedPosts === undefined || getUserById === undefined) {
    return <LoaderSpinner />;
  }

  // Ensure data is fetched before rendering
  if (!user || !getUserById || !allSavedPosts) {
    return null;
  }

  return (
    <div className={styles.dashboard__feeds}>
      <SearchBar></SearchBar>
      {user?.id === getUserById?.clerkId ? (
        <div className="flex flex-col gap-10">
          {allSavedPosts.length === 0 ? (
            <p className="text-center text-gel-gray">You have no saved posts</p>
          ) : (
            <div className={styles.post__box}>
              {allSavedPosts.map(
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
          )}
        </div>
      ) : (
        <div>
          <p className="text-center text-2xl font-bold text-gel-gray">
            {getUserById.name}&apos;s saved posts are private
          </p>
        </div>
      )}
    </div>
  );
};

export const page = () => {
  return (
    <>
      <SavedPosts />
    </>
  );
};

export default page;
