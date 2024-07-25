"use client";

import LoaderSpinner from "@/components/LoaderSpinner";
import PostCard from "@/components/PostCard";
import { PostProps } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SavedPosts = () => {
  const { user } = useUser();
  const allSavedPosts = useQuery(api.posts.getAllSavedPosts);
  const getUserById = useQuery(api.users.getUserById, {
    clerkId: user?.id,
  });

  return (
    <div className="mt-[12rem] text-2xl items-center">
      {user?.id === getUserById?._id ? (
        <div className="flex flex-col gap-10">
          {allSavedPosts?.length === 0 && (
            <p className="text-center text-gel-gray">
              {user?.id === getUserById?._id ? "You" : getUserById?.name}{" "}
              {user?.id === getUserById?._id ? "have" : "has"} no saved posts
            </p>
          )}
          {allSavedPosts?.map((post: any, i: number) => (
            <PostCard post={post as PostProps} key={post} />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-2xl font-bold text-gel-gray">
            {user?.id === getUserById?._id ? "You" : getUserById?.name}
            {"'s saved posts are private"}
          </p>
        </div>
      )}
    </div>
  );
};

export const page = () => {
  return (
    <>
      <SavedPosts></SavedPosts>
    </>
  );
};

export default page;
