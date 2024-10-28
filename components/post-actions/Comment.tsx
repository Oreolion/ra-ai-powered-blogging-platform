// import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import React, { useState } from "react";
import { AiOutlineComment } from "react-icons/ai";

const Comment = () => {
  const [commentCount, setCommentCount] = useState(0);
//   const formattedNumber = useNumFormatter(commentCount);

  return (
    <>
      <div className="flex items-center mt-[-.5rem]">
        <AiOutlineComment
          opacity={0.5}
          size={30}
          className="hover:opacity-100 cursor-pointer"
        />
      </div>
    </>
  );
};

export default Comment;
