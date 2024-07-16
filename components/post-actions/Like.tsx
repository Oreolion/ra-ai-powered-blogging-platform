import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

const Like = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeBounce, setLikeBounce] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const formattedNumber = useNumFormatter(likeCount);
  const { user } = useUser();


  const handleLike = () => {};

  return (
    <div>
      <div className="flex gap-1.5 items-center" onClick={handleLike}>
        {isLiked ? (
          <FcLike
            size={16}
            className={`opacity-50 hover:opacity-100 cursor-pointer ${
              likeBounce ? "scale-up" : ""
            }`}
          />
        ) : (
          <FcLikePlaceholder
            size={16}
            className=" opacity-50 hover:opacity-100 cursor-pointer"
          />
        )}
        <span className="text-xs">{formattedNumber}</span>
      </div>
    </div>
  );
};

export default Like;
