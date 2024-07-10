"use client";

import { useQuery } from "convex/react";

import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import PostCard from "@/components/PostCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const postsData = useQuery(api.posts.getPostByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !postsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col ml-[19rem] max-md:ml-[0]">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Your Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          postData={postsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {postsData && postsData.posts.length > 0 ? (
          <div className="post_grid">
            {postsData?.posts
              ?.slice(0, 4)
              .map((post: any) => (
                <PostCard
                  key={post._id}
                  imageUrl={post.imageUrl!}
                  title={post.postTitle!}
                  description={post.postDescription}
                  postId={post._id}
                />
              ))}
          </div>
        ) : (
          <EmptyStates
            title="You have not created any posts yet"
            buttonLink="/create-post"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
