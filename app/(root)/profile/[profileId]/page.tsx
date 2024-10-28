"use client";
import { useQuery } from "convex/react";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import HomeCard from "@/components/HomeCard";
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
    <section className="mt-9 flex flex-col ml-[9rem] max-md:ml-[0]">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Your Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          postData={postsData}
          imageUrl={user?.imageUrl}
          userFirstName={user?.name}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-[1.6rem] font-bold text-white-1">All Your Posts</h1>
        {postsData && postsData.posts.length > 0 ? (
          <div className="post_grid">
            {postsData?.posts
              ?.slice(0, 4)
              .map((post: any) => (
                <HomeCard
                  key={post._id}
                  imageUrl={post.imageUrl!}
                  title={post.postTitle!}
                  description={post.postDescription}
                  category={post.postCategory}
                  content={post.postContent}
                  authorId={post.authorId}
                  postId={post._id}
                  audioStorageId={post.audioStorageId}
                  imageStorageId={post.imageStorageId}
                  views={post.views}
                  likes={post.likes}
                  author={post.author}
                  authorImageUrl={post.authorImageUrl}
                  _creationTime={post._creationTime}
                />
              ))}
          </div>
        ) : (
          <EmptyStates
            title="You have not created any posts yet"
            buttonLink="/create-post"
            buttonText="Create Post"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
