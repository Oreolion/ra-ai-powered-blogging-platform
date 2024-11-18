"use client";
import styles from "@/styles/homefeeds.module.css";
import LoaderSpinner from "@/components/LoaderSpinner";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeCard from "@/components/HomeCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { Button } from "./ui/button";

export default function SavedPost() {
  const { user } = useUser();
  let allSavedPosts = useQuery(api.posts.getAllSavedPosts);
  const getUserById = useQuery(api.users.getUserById, {
    clerkId: user?.id,
  });

  allSavedPosts = [];
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
            <div className="max-h-[10rem] gap-4 flex items-center flex-col">
              <p className="text-center text-gel-gray mt-[3rem] text-2xl">
                You have no saved posts
              </p>
              <Button>
                <Link href="/dashboard">Go back to Home</Link>
              </Button>
            </div>
          ) : (
            <div className={styles.post__box}>
              {allSavedPosts.map(
                ({
                  _id,
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
                  imageStorageId,
                  audioStorageId,
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
                      imageStorageId={imageStorageId}
                      audioStorageId={audioStorageId}
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
}
