import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GenerateThumbnailProps } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { v4 as uuidv4 } from "uuid";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAIThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { toast } = useToast();

  const imageRef = useRef<HTMLInputElement>(null);
    const generateUploadUrl = useMutation(api.file.generateUploadUrl);
    const { startUpload } = useUploadFiles(generateUploadUrl);
    const getImageUrl = useMutation(api.posts.getUrl);

    const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });

        const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);

        const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      toast({ title: "Thumbnail generated successfully" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        variant: "destructive",
      });
    }
  };
  const generateImage = async () => {
    try {
      const response = await handleGenerateThumbnail({
        prompt: imagePrompt,
      });

      const blob = new Blob([response], { type: "image/png" });

        handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Generating Thumbnail",
        variant: "destructive",
      });
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      console.log(blob);
      handleImage(blob, file.name);
    } catch (error) {
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <div className="mt-[30px] flex w-full max-w-[520px] flex-col justify-between gap-4 rounded-sm border border-black-6 bg-black-1 px-2 py-2 md:flex-row md:gap-2">
        <button
          onClick={() => setIsAIThumbnail(true)}
          type="button"
          //   variant="plain"
          className={cn("w-[16rem] p-2 h-7 text-[.6rem]", {
            "bg-black-6 hover:bg-black-9 bg-slate-400": isAiThumbnail,
          })}
        >
          Use AI to generate Thumbnail
        </button>
        <button
          onClick={() => setIsAIThumbnail(false)}
          type="button"
          //   variant="plain"
          className={cn("w-[18rem] p-2 h-7 text-[.6rem]", {
            "bg-black-6 hover:bg-black-9 bg-slate-400": !isAiThumbnail,
          })}
        >
          Upload custom image
        </button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompts to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate Thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            ></Textarea>
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1 hover:bg-black-1"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className="animate-spin ml-2"></Loader>
                  Generating
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="flex-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1"
          onClick={() => {
            imageRef?.current?.click();
          }}
        >
          <Input
            type="file"
            ref={imageRef}
            onChange={uploadImage}
            className="hidden"
          ></Input>
          {!isImageLoading ? (
            <>
              <Image
                src="/icons/upload-image.svg"
                width={40}
                height={40}
                alt="upload"
              ></Image>
            </>
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2"></Loader>
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>{" "}
            <p className="text-12 font-normal text-gray-1">
              svg, png, jpeg or even gif (max: 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={350}
            height={20}
            className="mt-5"
            alt="thumbnail"
          ></Image>
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
