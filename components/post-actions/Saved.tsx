import { useNumFormatter } from "@/custom-hooks/useNumberFormatter";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { BsSave2, BsSave2Fill } from "react-icons/bs";
import { HiSaveAs } from "react-icons/hi";

const Saved = () => {
  const [saveCount, setSaveCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const formattedNumber = useNumFormatter(saveCount);
  const { user } = useUser();

  //   user?.id == currentUserId

  const handleSave = () => {};

  return (
    <div className="flex gap-1.5 items-cente">
      {currentUser?.uid !== userId ? (
        <div className="flex gap-1.5 items-center" onClick={handleSave}>
          {isSaved ? (
            <BsSave2Fill
              size={16}
              className=" opacity-50 hover:opacity-100 cursor-pointer"
            />
          ) : (
            <BsSave2
              size={16}
              className=" opacity-50 hover:opacity-100 cursor-pointer"
            />
          )}
        </div>
      ) : (
        <HiSaveAs size={16} className=" opacity-80" />
      )}
      <span className="text-xs">{formattedNumber}</span>
    </div>
  );
};

export default Saved;
