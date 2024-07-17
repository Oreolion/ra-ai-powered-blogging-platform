import { useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import styles from "@/styles/homefeeds.module.css";
import { useUser } from "@clerk/nextjs";
import { useTimeAgo } from "../custom-hooks/useTimeAgo";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { useToast } from "./ui/use-toast";
import { PostCardProps } from "@/types";
import Image from "next/image";
// import imgPlaceholder from "../assets/profile-placeholder.jpg";

export type Comment = {
  id: string;
  userId: string;
  savedAt?: number;
  createdAt: number;
  commentText: string;
};

type Props = {
  item: Comment;
  postInfo?: PostCardProps;
  postId: string;
  //   refetch: () => void;
};
export const PostComment = ({ item: comment, postId, postInfo }: Props) => {
  const [more, setMore] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editComment, setEditComment] = useState(comment.commentText);
  const { toast } = useToast();
  //   const getUserData = allUsers.find((user) => user?.id === comment?.userId);
  const { user, allUsers } = useUser();
  const timeAgo = useTimeAgo(comment.createdAt);

  const removeComment = async () => {
    try {
      //   const ref = doc(db, "posts", postId, "comments", comment.id);
      //   await deleteDoc(ref);
      toast({
        title: "comment has been removed",
      });
      //   refetch();
    } catch (error) {
      toast({
        title: "Error occured while removing comment",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      //   const ref = doc(db, "posts", postId, "comments", comment.id);
      //   await updateDoc(ref, {
      //     commentText: editComment,
      //     userId: user?.id,
      //   });
      setEditComment("");
      setIsEdit(false);
      toast({
        title: "Error occured while Editting comment",
        // variant: "success",
      });
      //   refetch();
    } catch (error) {
      toast({
        title: "Error occured while Editting Comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-1 border-b-[1px] p-2 border-[white] border-opacity-10">
      {!isEdit ? (
        <>
          <div className="flex items-start gap-2  mb-4 w-full">
          {postInfo ? (
          !postInfo.authorImageUrl ? (
            <>
              <span className={styles.span}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={styles.svg}
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </span>
            </>
          ) : (
            <Image
              src={postInfo.authorImageUrl}
              alt="userpicture"
              width={30}
              height={30}
            />
          )
        ) : null}
            <div className="flex-1 flex items-center justify-between">
              <div className="flex flex-col justify-center">
                {/* <p className="text-sm font-semibold mb-0 pb-0">
                  {getUserData?.username}
                </p> */}
                <span className="text-xs font-thin">{timeAgo}</span>
              </div>
              {user && user.id === comment.userId && (
                <div className="flex gap-2">
                  <MdModeEdit
                    size={16}
                    onClick={() => {
                      setIsEdit(true);
                      setEditComment(comment.commentText);
                    }}
                    className=" opacity-50 hover:opacity-100 cursor-pointer"
                  />
                  <MdOutlineDelete
                    size={16}
                    onClick={removeComment}
                    className=" opacity-50 hover:opacity-70 cursor-pointer hover:fill-[red]"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-[#d1d5db;]">
              {more
                ? comment.commentText
                : comment.commentText.substring(0, 100)}
              {comment.commentText.length > 100 && (
                <button type="button" onClick={() => setMore(!more)}>
                  {more ? "...less" : "...more"}
                </button>
              )}
            </p>
          </div>
        </>
      ) : (
        <div>
          <textarea
            rows={3}
            value={editComment}
            placeholder="What are your thoughts?"
            onChange={(e) => setEditComment(e.target.value)}
            className="border-gel-background border px-6 py-4"
          ></textarea>
          <div className="mt-5 flex justify-start gap-4">
            <button
              type="button"
              onClick={() => setIsEdit(false)}
              className="button button-action outlined-primary !p-3 !text-xs opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="button button-action solid-primary !p-3 !text-xs opacity-70 w-[120px]"
            >
              {!isLoading ? (
                <p className="text-primaryBackground">Update</p>
              ) : (
                <LoaderSpinner />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
