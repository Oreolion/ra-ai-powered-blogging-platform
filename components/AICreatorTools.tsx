"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader, Sparkles, Wand2, Expand, Type } from "lucide-react";

interface AICreatorToolsProps {
  postTitle: string;
  postContent: string;
  setPostTitle: (title: string) => void;
  setPostContent: (content: string) => void;
}

const TONES = ["Professional", "Casual", "Witty", "Academic", "Storytelling"];

export default function AICreatorTools({
  postTitle,
  postContent,
  setPostTitle,
  setPostContent,
}: AICreatorToolsProps) {
  const { toast } = useToast();
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isSuggestingTitles, setIsSuggestingTitles] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [showTonePicker, setShowTonePicker] = useState(false);

  const suggestTitles = useAction(api.openai.suggestTitlesAction);
  const expandContent = useAction(api.openai.expandContentAction);
  const rewriteTone = useAction(api.openai.rewriteToneAction);

  const handleSuggestTitles = async () => {
    if (!postContent.trim()) {
      toast({ title: "Write some content first", variant: "destructive" });
      return;
    }
    setIsSuggestingTitles(true);
    try {
      const result = await suggestTitles({ content: postContent });
      const titles = result
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);
      setSuggestedTitles(titles);
      toast({ title: "Titles generated!" });
    } catch (error: any) {
      toast({
        title: error.message || "Failed to suggest titles",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTitles(false);
    }
  };

  const handleExpand = async () => {
    if (!postContent.trim()) {
      toast({ title: "Write some content first", variant: "destructive" });
      return;
    }
    setIsExpanding(true);
    try {
      const result = await expandContent({ text: postContent });
      setPostContent(result);
      toast({ title: "Content expanded!" });
    } catch (error: any) {
      toast({
        title: error.message || "Failed to expand content",
        variant: "destructive",
      });
    } finally {
      setIsExpanding(false);
    }
  };

  const handleRewrite = async () => {
    if (!postContent.trim()) {
      toast({ title: "Write some content first", variant: "destructive" });
      return;
    }
    setIsRewriting(true);
    try {
      const result = await rewriteTone({ text: postContent, tone: selectedTone });
      setPostContent(result);
      toast({ title: `Rewritten in ${selectedTone} tone!` });
    } catch (error: any) {
      toast({
        title: error.message || "Failed to rewrite",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
      setShowTonePicker(false);
    }
  };

  const hasContent = postContent.trim().length > 0;

  return (
    <div className="mt-6 p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-orange-400" />
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">
          AI Creator Tools
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggestTitles}
          disabled={isSuggestingTitles || !hasContent}
          className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
        >
          {isSuggestingTitles ? (
            <Loader className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Wand2 className="w-4 h-4 mr-1" />
          )}
          Suggest Titles
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExpand}
          disabled={isExpanding || !hasContent}
          className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
        >
          {isExpanding ? (
            <Loader className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Expand className="w-4 h-4 mr-1" />
          )}
          Expand
        </Button>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTonePicker(!showTonePicker)}
            disabled={isRewriting || !hasContent}
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
          >
            {isRewriting ? (
              <Loader className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Type className="w-4 h-4 mr-1" />
            )}
            Rewrite: {selectedTone}
          </Button>

          {showTonePicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 min-w-[10rem]">
              {TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => {
                    setSelectedTone(tone);
                    setShowTonePicker(false);
                    handleRewrite();
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTone === tone
                      ? "bg-orange-500/20 text-orange-300"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {suggestedTitles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-slate-400">Suggested Titles:</p>
          <div className="flex flex-col gap-1.5">
            {suggestedTitles.map((title, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPostTitle(title);
                  setSuggestedTitles([]);
                  toast({ title: "Title applied!" });
                }}
                className="text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm hover:border-orange-500/40 hover:bg-slate-800 transition-colors"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
