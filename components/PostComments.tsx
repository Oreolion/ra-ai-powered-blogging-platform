import { useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import { PostComment } from "./PostComment";
import styles from "@/styles/homefeeds.module.css";
// import { db } from "../firebase/firebase";
import { useUser } from "@clerk/nextjs";
// import { useNavigate } from "next/navigation";
// import { addDoc, collection } from "firebase/firestore";
// import { useSingleFetch } from "../hooks/useSingleFetch";
// import imgPlaceholder from "../assets/profile-placeholder.jpg";
import { useToast } from "./ui/use-toast";
import { PostCardProps } from "@/types";
import Image from "next/image";

type Props = {
  postId: string;
  postInfo?: PostCardProps;
};

export const PostComments = ({ postId, postInfo }: Props) => {
  //   const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<[]>([]);
  const { user, allUsers } = useUser();
  const [loading, setLoading] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(5);

  const { toast } = useToast();
  //   const getUserData = allUsers.find((user) => user.id === user?.uid);

  //   check if comment already exist in database
  //   const { data, isLoading, refetch } = useSingleFetch(
  //     "posts",
  //     postId,
  //     "comments"
  //   );
  // use as a placeholder for isLoading in destructured object above
  const isLoading = comments.length > 0;

  const writeComment = async () => {
    try {
      setLoading(true);
      if (comment === "" && user) {
        toast({
          title: "Input field is required",
          variant: "destructive",
        });
        return;
      }
      if (user) {
        // const commentRef = collection(db, "posts", postId, "comments");
        // await addDoc(commentRef, {
        //   commentText: comment,
        //   createdAt: Date.now(),
        //   userId: user?.id,
        // });
        toast({
          title: "comment Added",
        });
        // refetch();
        setComment("");
      } else {
        // navigate("/sign-in");
      }
    } catch (error) {
      toast({
        title: "Error occured while Adding comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = () => {
    setCommentsToShow((prev) => prev + 5);
  };

  return (
    <div className="flex flex-col gap-2 text-sm text-gray-2">
      <form className="border border-1 border-[white] border-opacity-10 rounded-3xl p-4">
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
        <textarea
          value={comment}
          rows={3}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="border-gel-background border px-6 py-4"
        ></textarea>
        <div className="mt-5 flex justify-start gap-4">
          <button
            type="button"
            onClick={() => setComment("")}
            className="button button-action outlined-primary !p-3 !text-xs opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={writeComment}
            className="button button-action solid-primary !p-3 !text-xs opacity-70 w-[120px]"
          >
            {!loading ? (
              <p className="text-primaryBackground">Comment</p>
            ) : (
              <LoaderSpinner />
            )}
          </button>
        </div>
      </form>
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <>
          {comments && comments.length === 0 ? (
            <p className="text-xs font-medium opacity-50 text-center mt-3">
              Be the first to comment on this post
            </p>
          ) : (
            <>
              {comments.slice(0, commentsToShow).map((item, i) => (
                <PostComment
                  key={i}
                  postId={postId}
                  //   refetch={refetch}
                  item={item as Comment}
                />
              ))}
              {comments.length > commentsToShow && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={loadMoreComments}
                    className="!p-3 !text-xs opacity-50 lg:min-w-[150px]"
                  >
                    Load More...
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
