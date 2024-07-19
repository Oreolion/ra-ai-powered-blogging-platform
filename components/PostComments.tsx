import { useEffect, useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import styles from "@/styles/comments.module.css";
import { useUser } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { PostCardProps, PostCommentsArrayType } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTimeAgo } from "../custom-hooks/useTimeAgo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";

export const PostComments = ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  //   const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<PostCommentsArrayType>([]);
  const [toggleComment, setToggleComment] = useState<boolean>(true);
  const [more, setMore] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  //   const [commentsToShow, setCommentsToShow] = useState(5);
  const { user, allUsers } = useUser();
  //   const timeAgo = useTimeAgo(comment.createdAt);
  const router = useRouter();
  const { toast } = useToast();
  const addComment = useMutation(api.posts.createComment);
  const postComments = useQuery(api.posts.getComments, {
    postId: postId,
  });
  //   const getUserData = allUsers.find((user) => user.id === user?.uid);

  //   check if comment already exist in database
  //   const { data, isLoading, refetch } = useSingleFetch(
  //     "posts",
  //     postId,
  //     "comments"
  //   );
  // use as a placeholder for isLoading in destructured object above

  useEffect(() => {
    setComments(postComments);
    console.log(postComments);
  }, [postComments]);

  const handleToggleCommentBox = () => {
    setToggleComment(false);
  };

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
        // refetch();
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

  //   const loadMoreComments = () => {
  //     setCommentsToShow((prev) => prev + 5);
  //   };

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
    <div className={styles.comment__box}>
      {!isEdit ? (
        <>
          {comments && comments.length > 0 ? (
            <div className={styles.comment__lists}>
              {comments.map((comment, i) => {
                return (
                  <>
                    <div className={styles.user}>
                      <div className={styles.user__profile}>
                        <div className={styles.user__image}>
                          <span className="" v-if="!each.photoURL">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                            >
                              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                            </svg>
                          </span>
                          {/* <img :src="each.photoURL" alt="picture" v-else /> */}
                        </div>
                        <h3 className={styles.username}>
                          {/* {{ each.comment.displayName || each.comment.email }} */}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex flex-col justify-center">
                        <p className={styles.username}>{user?.firstName}</p>
                        {/* <span className="text-xs font-thin">{timeAgo}</span> */}
                      </div>
                      {user && user.id === comment.userId && (
                        <div className="flex gap-2">
                          <MdModeEdit
                            size={25}
                            onClick={() => {
                              setIsEdit(true);
                              setEditComment(comment.content);
                            }}
                            className=" opacity-50 hover:opacity-100 cursor-pointer"
                          />
                          <MdOutlineDelete
                            size={25}
                            onClick={removeComment}
                            className=" opacity-50 hover:opacity-70 cursor-pointer hover:fill-[red]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <p className="text-xs text-[#d1d5db;]">
                        {more
                          ? comment.content
                          : comment.content.substring(0, 100)}
                        {comment.content.length > 100 && (
                          <button type="button" onClick={() => setMore(!more)}>
                            {more ? "...less" : "...more"}
                          </button>
                        )}
                      </p>
                    </div>
                  </>
                );
              })}
            </div>
          ) : (
            "Be the First to Comment"
          )}

          <div className={styles.user}>
            <div className={styles.user__profile}>
              <div className={styles.user__image}>
                {user?.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
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
                placeholder="add comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </label>
            <div className={styles.btnbox}>
              <button type="button" onClick={handleToggleCommentBox}>
                cancel
              </button>
              <button type="button" onClick={createComment}>
                comment
              </button>
            </div>
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
