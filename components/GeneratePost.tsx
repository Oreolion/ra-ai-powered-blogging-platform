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
  setPostContent,
}: GeneratePostProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const getPost = useAction(api.openai.generatePostAction);

  const generatePost = async () => {
    setIsGenerating(true);

    if (!prompt) {
      toast({
        title: "Please provide a prompt to generate the post",
      });
      return setIsGenerating(false);
    }

    try {
      const generatedPostContent = await getPost({ prompt });
      setIsGenerating(false);
      toast({
        title: "Post Generated Successfully",
      });
      setPostContent(generatedPostContent);
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
    prompt,
    setPrompt,
  };
};

const GeneratePost = (props: GeneratePostProps) => {
  const { isGenerating, generatePost, prompt, setPrompt } =
    useGeneratePost(props);
  const [markdown, setMarkdown] = useState(props.postContent);

  const handleGeneratePost = async () => {
    const generatedPostContent = await generatePost();
    if (generatedPostContent) {
      setMarkdown(generatedPostContent);
    }
  };

  return (
    <div className='mt-[-3rem]'>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-gray-200">
          Write Your Post
        </Label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt to Generate article with AI here"
          className="input-class font-light focus-visible:ring-offset-orange-1 h-[3rem] indent-2 max-ssm:text-sm"
        />
        <MarkdownEditor
        className="max-w-full"
          value={markdown}
          height="220px"
          maxWidth="50rem"
          onChange={(value) => {
            setMarkdown(value);
            props.setPostContent(value);
          }}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-gray-200 hover:bg-black-1"
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
        Click button only to generate Article with AI after you have input your
        research prompt in the PROMPT field above...
      </p>
    </div>
  );
};

export default GeneratePost;
