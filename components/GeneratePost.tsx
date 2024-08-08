import React, { useState } from "react";
import { GeneratePostProps } from "@/types";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import MarkdownEditor from "@uiw/react-markdown-editor";

const useGeneratePost = ({
  postContent,
  postDescription,
  postCategory,
}: GeneratePostProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getPost = useAction(api.openai.generatePostAction);

  const generatePost = async () => {
    setIsGenerating(true);

    if (!postContent) {
      toast({
        title: "Please provide content to generate the post",
      });
      return setIsGenerating(false);
    }

    try {
      const generatedPostContent = await getPost({
        prompt: postContent,
      });

      setIsGenerating(false);
      toast({
        title: "Post Generated Successfully",
      });

      return generatedPostContent;
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: "Error generating a Post, please try again",
        variant: "destructive",
      });
      setIsGenerating(false);
      return null;
    }
  };

  return {
    isGenerating,
    generatePost,
  };
};

const GeneratePost = (props: GeneratePostProps) => {
  const { isGenerating, generatePost } = useGeneratePost(props);
  const [markdown, setMarkdown] = useState(props.postContent);

  const handleGeneratePost = async () => {
    const generatedPostContent = await generatePost();
    if (generatedPostContent) {
      setMarkdown(generatedPostContent);
      props.setPostContent(generatedPostContent);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Write Your Posts
        </Label>
        <MarkdownEditor
          value={markdown}
          height="200px"
          onChange={(value) => {
            setMarkdown(value);
            props.setPostContent(value);
          }}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16  bg-orange-1 py-4 font-bold text-white-1 hover:bg-black-1"
          onClick={handleGeneratePost}
        >
          {isGenerating ? (
            <>
              <Loader size={20} className="animate-spin ml-2"></Loader>
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      <p className="text-green-200 text-[.72rem] font-bold max-w-[35rem]">
        click button only to generate Article with AI after you have input your
        research prompt in the field above...
      </p>
    </div>
  );
};

export default GeneratePost;
