import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { AiOutlineComment } from "react-icons/ai";

const Comment = () => {
  const [commentCount, setCommentCount] = useState(0);
  const formattedNumber = useNumFormatter(commentCount);
  const { user } = useUser();

  return (
    <>
      <div className="flex gap-1.5 items-center mt-[-.5rem]">
        <AiOutlineComment
          opacity={0.5}
          size={30}
          className="hover:opacity-100 cursor-pointer"
        />
        {/* <span className="text-xs font-semibold opacity-80 ">
          {formattedNumber}
        </span> */}
      </div>
    </>
  );
};

export default Comment;
