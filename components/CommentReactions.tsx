"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

const EMOJIS = ["👍", "❤️", "🔥", "🎉", "💡"];

interface CommentReactionsProps {
  commentId: Id<"comments">;
}

export default function CommentReactions({ commentId }: CommentReactionsProps) {
  const { user } = useUser();
  const toggleReaction = useMutation(api.posts.toggleCommentReaction);
  const reactions = useQuery(api.posts.getCommentReactions, { commentId });
  const userReaction = useQuery(api.posts.getUserCommentReaction, { commentId });

  if (!reactions || reactions.total === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-2">
      {Object.entries(reactions.grouped).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => {
            if (!user) return;
            toggleReaction({ commentId, emoji });
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
            userReaction === emoji
              ? "bg-orange-500/20 border border-orange-500/40 text-orange-300"
              : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:bg-slate-700/50"
          }`}
        >
          <span>{emoji}</span>
          <span className="font-medium">{count}</span>
        </button>
      ))}
    </div>
  );
}

export function CommentReactionPicker({
  commentId,
}: {
  commentId: Id<"comments">;
}) {
  const { user } = useUser();
  const toggleReaction = useMutation(api.posts.toggleCommentReaction);
  const userReaction = useQuery(api.posts.getUserCommentReaction, { commentId });

  if (!user) return null;

  return (
    <div className="flex items-center gap-0.5">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => toggleReaction({ commentId, emoji })}
          className={`p-1 rounded-md text-sm transition-transform hover:scale-125 ${
            userReaction === emoji ? "bg-orange-500/20" : "hover:bg-slate-700/50"
          }`}
          title={userReaction === emoji ? "Remove reaction" : `React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
