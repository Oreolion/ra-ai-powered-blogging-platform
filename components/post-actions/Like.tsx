import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useToast } from "../ui/use-toast";

const Like = ({likes}: {likes: number}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeBounce, setLikeBounce] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const formattedNumber = useNumFormatter(likeCount);
  const { user } = useUser();
 const { toast } = useToast()

  useEffect(() => {
    if (likes) {
    //   const currentPostLikes = likes;
      setLikeCount(likes);
    //   setIsLiked(
    //     data && data.findIndex((item) => item.id === user?.id) !== -1
    //   );
    }
  }, [likes, user]);

  const handleLike = async () => {
    try {
      if (user) {
        // const likeRef = doc(db, "posts", id, "likes", currentUser?.uid);

        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        if (isLiked) {
        //   await deleteDoc(likeRef);
        } else {
        //   await setDoc(likeRef, {
        //     userId: currentUser?.uid,
        //   });
        }
        setLikeBounce(true);

        setTimeout(() => {
          setLikeBounce(false);
        }, 2000);

        // setTimeout(() => {
        //   refetch();
        // }, 5000);
      } else {
        // navigate("/sign-in");
      }
    } catch (error) {
        toast({
            title: "Error occured while Creating post",
            variant: "destructive",
          });
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
    }
  };

  return (
    <div>
      <div className="flex gap-1.5 items-center" onClick={handleLike}>
        {isLiked ? (
          <FcLike
            size={30}
            className={`opacity-50 hover:opacity-100 cursor-pointer ${
              likeBounce ? "scale-up" : ""
            }`}
          />
        ) : (
          <FcLikePlaceholder
            size={30}
            className="opacity-50 hover:opacity-100 cursor-pointer"
          />
        )}
        <span className="text-2xl">{formattedNumber}</span>
      </div>
    </div>
  );
};

export default Like;
