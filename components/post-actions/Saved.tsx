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
  const [saveCount, setSaveCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const formattedNumber = useNumFormatter(saveCount);
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const savedPost = useMutation(api.posts.createSavedPost);
  const userId = useQuery(api.users.getUserById, {
    clerkId: user?.id,
  });
  const allUsers = useQuery(api.users.getAllUsers);
  const deleteSavedPost = useMutation(api.posts.deleteSavedPost);

  useEffect(() => {
    if (allUsers) {
      setIsSaved(allUsers.some((savedPost: any) => savedPost._id === user?.id));
    }
  }, [allUsers, user?.id]);

  useEffect(() => {
    console.log(savedPost);
    setSaveCount(savedPost.length);
  }, [savedPost]);

  const handleSave = async () => {
    try {
      if (user) {
        // const savedRef = doc(db, "users", currentUser.uid, "savedPost", id);
        // const savesRef = doc(db, "posts", id, "saves", currentUser.uid);

        setIsSaved(!isSaved);

        setSaveCount((prevCount) => (isSaved ? prevCount - 1 : prevCount + 1));

        if (isSaved) {
          //   await deleteDoc(savedRef);
          await deleteSavedPost({
            postId: post._id,
            imageStorageId: post.imageStorageId,
            audioStorageId: post.audioStorageId!,
          });

          toast({
            title: "Post has been removed from Bookmarks",
          });

          //   await deleteDoc(savesRef);
        } else {
          const saved = await savedPost({
            postTitle: post.postTitle,
            postDescription: post.postDescription,
            postContent: post.postContent,
            postCategory: post.postCategory,
            postId: post._id,
            audioUrl: post.audioUrl,
            imageUrl: post.imageUrl,
            views: post.views,
            likes: post.likes,
            audioStorageId: audioStorageId!,
            audioDuration: post?.audioDuration,
            imageStorageId: post.imageStorageId,
          });
          toast({
            title: "Post Added to Bookmarks",
          });
          //   await setDoc(savesRef, {
          //     userId: user?.id,
          //   });
        }
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Error occurred while Saving Post",
        variant: "destructive",
      });
      setIsSaved(!isSaved);
      setSaveCount((prevCount) => (isSaved ? prevCount + 1 : prevCount - 1));
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
              className=" opacity-50 hover:opacity-100 cursor-pointer"
            />
          ) : (
            <BsSave2
              size={25}
              className=" opacity-50 hover:opacity-100 cursor-pointer"
            />
          )}
        </div>
      ) : (
        <HiSaveAs size={25} className=" opacity-80" />
      )}
      <span className="text-xl mt-[-1rem]">{formattedNumber}</span>
    </div>
  );
};

export default Saved;
