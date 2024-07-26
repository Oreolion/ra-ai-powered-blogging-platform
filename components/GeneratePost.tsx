import React, { useState } from "react";
import { GeneratePostProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/ui/use-toast";

const useGeneratePost = ({
  setAudio,
  postContent,
  postCategory,
  setAudioStorageId,
}: GeneratePostProps) => {
  // logic for podcast generation
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  // @ts-ignore

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPostAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.posts.getUrl);

  const generatePost = async () => {
    setIsGenerating(true);
    // setAudio("");
    if (!postContent) {
      toast({
        title: "Please provide a voice type to generate post audio",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPostAudio({
        category: postCategory,
        postContent: postContent,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `post-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Post Generated Successfully",
      });
    } catch (error: any) {
      console.log(error.message);
      toast({
        title: "Error creating a Post, please try again",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePost,
  };
};

const GeneratePost = (props: GeneratePostProps) => {
  const { isGenerating, generatePost } = useGeneratePost(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Write Your Posts
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Write your Post here..."
          rows={5}
          value={props.postContent}
          onChange={(e) => props.setPostContent(e.target.value)}
        ></Textarea>
      </div>
      <div className="mt-5 w-full max-w-[200px]">

        <Button
          type="submit"
          className="text-16  bg-orange-1 py-4 font-bold text-white-1 hover:bg-black-1"
          onClick={generatePost}
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
      <p className="text-green-200 text-[.72rem] font-bold max-w-[35rem]">click button only to generate Post with AI after you have input your research prompt in the text area above</p>

      {/* {props.audio && (
        <audio
          src={props.audio}
          controls
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        ></audio>
      )} */}
    </div>
  );
};

export default GeneratePost;
