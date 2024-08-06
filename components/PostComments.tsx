import { useEffect, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import styles from "@/styles/comments.module.css";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { PostCommentsArrayType, PostCommentType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTimeAgo } from "../custom-hooks/useTimeAgo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { Id } from "@/convex/_generated/dataModel";

export const PostComments = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<PostCommentsArrayType>([]);
  const [toggleComment, setToggleComment] = useState<boolean>(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const [more, setMore] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const addComment = useMutation(api.posts.createComment);
  const deleteComment = useMutation(api.posts.deleteComment);
  const editCommentMutation = useMutation(api.posts.editComment);
  const postComments = useQuery(api.posts.getComments, { postId });
  const userId = useQuery(api.users.getUserById, { clerkId: user?.id });

  useEffect(() => {
    setComments(postComments);
  }, [postComments]);

  const createComment = async () => {
    try {
      setLoading(true);
      if (comment === "" && user) {
        toast({
          title: "The Input field is required",
          variant: "destructive",
        });
        return;
      }
      if (user) {
        await addComment({
          postId,
          content: comment,
        });

        toast({
          title: "You added a comment",
        });
        setComment("");
      } else {
        router.push("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Error Adding Comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      // Add the mutation to delete the comment from the database
      if (user) {
        await deleteComment({
          _id: commentId,
        });
      }
      toast({
        title: "Comment has been removed",
      });
    } catch (error) {
      toast({
        title: "Error occurred while removing comment",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async ({ _id, newContent }: { _id: Id<"comments">, newContent: string }) => {
    setIsLoading(true);
    try {
      // Add the mutation to update the comment in the database
      if (user && user.id) {
        console.log("userId:", user.id); // Log the user ID value
        // await editCommentMutation({
        //     _id,
        //     newContent,
        //     userId: user.id  as Id<"users">,
        // });
        
        await editCommentMutation({
            _id,
            newContent,
            userId: user.id,
          });
      }
      setEditComment("");
      setIsEdit(false);
      toast({
        title: "Comment edited successfully",
      });
    } catch (error) {
      toast({
        title: "Error occurred while editing comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toggleComment && (
        <div className={styles.comment__box}>
          {comments && comments.length > 0 ? (
            <ul className={styles.commentlist}>
              {comments.map((comment, i) => (
                <li className={styles.comment__item} key={i}>
                  <div className={styles.user__profile}>
                    {comment.commentUserImage ? (
                      <Image
                        src={comment.commentUserImage}
                        alt="userpicture"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <span className={styles.span}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                      </span>
                    )}
                    <p className={styles.username}>{user?.firstName}</p>
                  </div>
                  <p className="text-xl text-[#d1d5db;]">
                    {more ? comment.content : comment.content.substring(0, 100)}
                    {comment.content.length > 100 && (
                      <button type="button" onClick={() => setMore(!more)}>
                        {more ? "...less" : "...more"}
                      </button>
                    )}
                  </p>
                  {user && userId?._id === comment.userId && (
                    <div className="flex gap-[1rem]">
                      <MdModeEdit
                        size={25}
                        onClick={() => {
                          setIsEdit(true);
                          setEditComment(comment.content);
                          setEditingCommentId(comment._id);

                        }}
                        className="opacity-50 hover:opacity-100 cursor-pointer"
                      />
                      <MdOutlineDelete
                        size={25}
                        onClick={() => removeComment(comment._id)}
                        className="opacity-50 hover:opacity-70 cursor-pointer hover:fill-[red]"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            "Be the First to Comment"
          )}

          {!isEdit ? (
            <div className={styles.comment__inputbox}>
              <div className={styles.user}>
                <div className={styles.user__profile}>
                  <div className={styles.user__image}>
                    {userId?.imageUrl ? (
                      <Image
                        src={userId?.imageUrl}
                        alt="userpicture"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <span className={styles.span}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.textbox}>
                <label>
                  <textarea
                    className={styles.textarea}
                    placeholder="What are your thoughts?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </label>
              </div>
              <div className={styles.btnbox}>
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => setToggleComment(!toggleComment)}
                >
                  cancel
                </button>
                <button
                  className={styles.button}
                  type="button"
                  onClick={createComment}
                >
                  comment
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-[2rem]">
              <textarea
                rows={3}
                value={editComment}
                placeholder="What are your thoughts?"
                onChange={(e) => setEditComment(e.target.value)}
                className={styles.textarea}
              ></textarea>
              <div className={styles.btnbox}>
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className={styles.button}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // e.preventDefault();
                    if (editingCommentId && editComment) {
                      handleEdit({ 
                        _id: editingCommentId, 
                        newContent: editComment 
                      });
                    }
                  }}
                  className={styles.button}
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
      )}
    </>
  );
};
