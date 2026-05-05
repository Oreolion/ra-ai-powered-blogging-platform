"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { HandsClapping } from "lucide-react";

interface ClapsProps {
  postId: Id<"posts">;
}

export default function Claps({ postId }: ClapsProps) {
  const { user } = useUser();
  const clapMutation = useMutation(api.posts.clapPost);
  const clapData = useQuery(api.posts.getPostClaps, { postId });
  const userClapCount = useQuery(api.posts.getUserClap, { postId });

  const [isClapping, setIsClapping] = useState(false);
  const [localClaps, setLocalClaps] = useState(0);
  const clapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingClapsRef = useRef(0);

  const flushClaps = useCallback(() => {
    if (pendingClapsRef.current > 0) {
      clapMutation({ postId, count: pendingClapsRef.current });
      pendingClapsRef.current = 0;
      setLocalClaps(0);
    }
    setIsClapping(false);
  }, [clapMutation, postId]);

  const handleClap = () => {
    if (!user) return;

    pendingClapsRef.current += 1;
    setLocalClaps((prev) => prev + 1);
    setIsClapping(true);

    if (clapTimerRef.current) {
      clearTimeout(clapTimerRef.current);
    }

    clapTimerRef.current = setTimeout(flushClaps, 800);
  };

  const handleClapEnd = () => {
    if (clapTimerRef.current) {
      clearTimeout(clapTimerRef.current);
    }
    clapTimerRef.current = setTimeout(flushClaps, 500);
  };

  const totalClaps = (clapData?.totalClaps || 0) + localClaps;
  const displayCount = totalClaps > 0 ? totalClaps.toLocaleString() : "Clap";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClap}
        onMouseUp={handleClapEnd}
        onMouseLeave={handleClapEnd}
        onTouchEnd={handleClapEnd}
        disabled={!user}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
          isClapping
            ? "bg-orange-500/20 text-orange-400 scale-110"
            : "text-slate-400 hover:text-orange-400 hover:bg-slate-800/50"
        }`}
        title={user ? "Click repeatedly to clap" : "Sign in to clap"}
      >
        <HandsClapping
          className={`w-5 h-5 transition-transform ${
            isClapping ? "animate-bounce" : ""
          }`}
        />
        <span className="text-sm font-medium">{displayCount}</span>
      </button>

      {clapData && clapData.clapperCount > 0 && (
        <span className="text-xs text-slate-500">
          from {clapData.clapperCount}{" "}
          {clapData.clapperCount === 1 ? "reader" : "readers"}
        </span>
      )}
    </div>
  );
}
