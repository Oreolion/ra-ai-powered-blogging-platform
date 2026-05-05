"use client";
import Image from "next/image";
import { ProfileCardProps } from "@/types";
import LoaderSpinner from "./LoaderSpinner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, UserCheck } from "lucide-react";

const ProfileCard = ({
  postData,
  imageUrl,
  userFirstName,
  profileClerkId,
}: ProfileCardProps & { profileClerkId: string }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const followerCount = useQuery(api.posts.getFollowerCount, { userId: profileClerkId });
  const followingCount = useQuery(api.posts.getFollowingCount, { userId: profileClerkId });
  const isFollowing = useQuery(api.posts.isFollowing, { followingId: profileClerkId });
  const followMutation = useMutation(api.posts.followUser);

  if (!imageUrl) return <LoaderSpinner />;

  const isOwnProfile = user?.id === profileClerkId;

  const handleFollow = async () => {
    try {
      const result = await followMutation({ followingId: profileClerkId });
      toast({
        title: result.action === "followed" ? "Following!" : "Unfollowed",
      });
    } catch (error: any) {
      toast({
        title: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center max-md:flex-row max-ssm:ml-[-1rem]">
      <Image
        src={imageUrl}
        width={160}
        height={160}
        alt="Poster"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-gray-400">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-gray-400">
            {userFirstName}
          </h1>
        </div>

        <div className="flex items-center gap-4 py-3">
          <figure className="flex gap-2 items-center">
            <Image
              src="/images/icons8-views-64.png"
              width={24}
              height={24}
              alt="readers"
            />
            <h2 className="text-23 font-semibold text-gray-200">
              {postData?.listeners} &nbsp;
              <span className="font-normal text-gray-200">Readers</span>
            </h2>
          </figure>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-slate-400">
            <strong className="text-white">{followerCount ?? 0}</strong> Followers
          </span>
          <span className="text-sm text-slate-400">
            <strong className="text-white">{followingCount ?? 0}</strong> Following
          </span>
        </div>

        {!isOwnProfile && user && (
          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isFollowing
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
