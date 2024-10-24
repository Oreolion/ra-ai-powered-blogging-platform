// import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
// import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { AiOutlineComment } from "react-icons/ai";

const Comment = () => {
  const [commentCount, setCommentCount] = useState(0);
//   const formattedNumber = useNumFormatter(commentCount);
//   const { user } = useUser();

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
