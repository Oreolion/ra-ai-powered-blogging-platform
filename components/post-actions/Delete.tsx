import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

const Delete = ({
  postId,
  imageStorageId,
  audioStorageId,
}: {
  postId: Id<"posts">;
  audioStorageId?: Id<"_storage"> | null;
  imageStorageId?: Id<"_storage"> | null;
}) => {
  const { user } = useUser();
  const deletePost = useMutation(api.posts.deletePost);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (user) {
        await deletePost({
          postId,
          imageStorageId: imageStorageId!,
          audioStorageId: audioStorageId ?? null,
        });

        toast({
          title: "Post has been deleted",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error occurred while deleting Post",
        variant: "destructive",
      });
      console.error(`Error deleting post: ${error.message}`);

    }
  };

  return (
    <div
      className="flex gap-1.5 items-center mt-[-1rem]"
      onClick={handleDelete}
    >
      <MdOutlineDeleteOutline
        size={30}
        className=" opacity-70  cursor-pointer hover:fill-[red]"
      />
    </div>
  );
};

export default Delete;
