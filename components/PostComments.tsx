import { useState } from "react";
import LoaderSpinner from "./LoaderSpinner";
import { PostComment } from "./PostComment";
import styles from "@/styles/comments.module.css";
// import { db } from "../firebase/firebase";
import { useUser } from "@clerk/nextjs";
// import { useNavigate } from "next/navigation";
// import { addDoc, collection } from "firebase/firestore";
// import { useSingleFetch } from "../hooks/useSingleFetch";
import { useToast } from "./ui/use-toast";
import { PostCardProps } from "@/types";
import Image from "next/image";

// type Props = {
//   postId: string;
//   postInfo?: PostCardProps;
// };

export const PostComments = ({ postId }) => {
  //   const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<[]>([]);
  const [toggleComment, setToggleComment] = useState<boolean>(true);

  const { user, allUsers } = useUser();
  const [loading, setLoading] = useState(false);
  //   const [commentsToShow, setCommentsToShow] = useState(5);

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
  const handleToggleCommentBox = () => {
    setToggleComment(false);
  };

  const createComment = () => {};

  //   const writeComment = async () => {
  //     try {
  //       setLoading(true);
  //       if (comment === "" && user) {
  //         toast({
  //           title: "Input field is required",
  //           variant: "destructive",
  //         });
  //         return;
  //       }
  //       if (user) {
  //         // const commentRef = collection(db, "posts", postId, "comments");
  //         // await addDoc(commentRef, {
  //         //   commentText: comment,
  //         //   createdAt: Date.now(),
  //         //   userId: user?.id,
  //         // });
  //         toast({
  //           title: "comment Added",
  //         });
  //         // refetch();
  //         setComment("");
  //       } else {
  //         // navigate("/sign-in");
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "Error occured while Adding comment",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const loadMoreComments = () => {
  //     setCommentsToShow((prev) => prev + 5);
  //   };

  return (
    <div
      className={styles.comment__box}
      // v-if="toggleCommentBox"
    >
      <div className={styles.comment__lists}>
        <div
        // v-for="each in commentLists"
        // :key="each.email"
        // v-if="commentLists.length"
        >
          <div className={styles.user}>
            <div className={styles.user__profile}>
              <div className={styles.user__image}>
                <span className="" v-if="!each.photoURL">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
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
          <div className={styles.comment__content}>
            {/* {{ each.comment.comment }} */}
          </div>
        </div>
      </div>
      <div className={styles.user}>
        <div className={styles.user__profile}>
          <div className={styles.user__image}>
            <span className="" v-if="!profile.photoURL">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
            </span>
            {/* <img :src="profile.photoURL" alt="picture" v-else /> */}
          </div>
          <h3 className={styles.username}>
            {/* {{ profile.displayName.toUpperCase() || profile.email }} */}
          </h3>
        </div>
      </div>
      <label>
        <textarea
          className={styles.textarea}
          placeholder="add comment..."
        //   v-model="comment.comment"
        // value={}
        ></textarea>
      </label>
      <br />
      <div className={styles.btnbox}>
        <button onClick={handleToggleCommentBox}>cancel</button>
        <button onClick={createComment}>comment</button>
      </div>
    </div>
  );
};
