import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BsSave2, BsSave2Fill } from "react-icons/bs";
import { HiSaveAs } from "react-icons/hi";
import { useToast } from "../ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostProps } from "@/types";

const Saved = ({
  post,
  audioStorageId,
}: {
  post: PostProps;
  audioStorageId: string;
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const userId = useQuery(api.users.getUserById, { clerkId: user?.id });
  const savePostMutation = useMutation(api.posts.createSavedPost);
  const deleteSavedPostMutation = useMutation(api.posts.deleteSavedPost);
  const savedPosts = useQuery(api.posts.getAllSavedPosts);

  const formattedNumber = useNumFormatter(saveCount);

  useEffect(() => {
    if (savedPosts && user) {
      const postSaves = savedPosts.filter(
        (savedPost: any) => savedPost.postId === post._id
      );
      const isPostSaved = postSaves.some(
        (savedPost: any) => savedPost.userId === user.id
      );
      setIsSaved(isPostSaved);
      setSaveCount(postSaves.length);
    }
  }, [savedPosts, post._id, user]);

  const handleSave = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      if (isSaved) {
        await deleteSavedPostMutation({
          postId: post._id,
          imageStorageId: post.imageStorageId,
          audioStorageId: post.audioStorageId!,
        });
        setIsSaved(false);
        setSaveCount((prev) => prev - 1);
        toast({ title: "Post has been removed from Bookmarks" });
      } else {
        await savePostMutation({
          postTitle: post.postTitle,
          postDescription: post.postDescription,
          postContent: post.postContent,
          postCategory: post.postCategory,
          postId: post._id,
          audioUrl: post.audioUrl,
          imageUrl: post.imageUrl,
          views: post.views,
          likes: post.likes,
          imagePrompt: post.imagePrompt,
          audioStorageId: audioStorageId!,
          audioDuration: post?.audioDuration,
          imageStorageId: post.imageStorageId,
        });
        setIsSaved(true);
        setSaveCount((prev) => prev + 1);
        toast({ title: "Post Added to Bookmarks" });
      }
      //   await savedPosts.refetch();
    } catch (error) {
      toast({
        title: "Error occurred while Saving Post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      {user?.id !== userId ? (
        <div
          className="flex gap-1.5 items-center mt-[-1rem]"
          onClick={handleSave}
        >
          {isSaved ? (
            <BsSave2Fill
              size={25}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
          ) : (
            <BsSave2
              size={25}
              className="opacity-50 hover:opacity-100 cursor-pointer"
            />
          )}
        </div>
      ) : (
        <HiSaveAs size={25} className="opacity-80" />
      )}
      <span className="text-xl mt-[-1rem]">{formattedNumber}</span>
    </div>
  );
};

export default Saved;
