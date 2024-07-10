"use client";
import styles from "@/styles/addblogpost.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import GeneratePost from "@/components/GeneratePost";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  postTitle: z.string().min(2),
  postDescription: z.string().min(2),
  postContent: z.string().min(2),
});

export default function AddBlogPost() {
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState("");
//   const [audioDuration, setAudioDuration] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [postCategory, setPostCategory] = useState<string | null>(null);
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  // @ts-ignore
  const createPost = useMutation(api.posts.createPost);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postTitle: "",
      postDescription: "",
      postContent: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (!postContent || !imageUrl || !postCategory) {
        toast({
          title: "Please Create Post",
          variant: "destructive",
        });
        setIsSubmitting(false);
        throw new Error("Please Create Post and Add Thumbnail");
      }

      const post = await createPost({
        postTitle: data.postTitle,
        postDescription: data.postDescription,
        postCategory,
        postContent,
        // audioUrl,
        imageUrl,
        imagePrompt,
        views: 0,
        // audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast({
        title: "Post Created Successfully",
        variant: "success",
      });
      setIsSubmitting(false);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured while Creating post",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  const postCategories = ["Technology", "Metaphysics & Esoterics", "Science", "World News", "Africa", "Programming", "Machine Learning", "Artificial Intelligence" ];
  return (
    <section className={styles.bloginput__box}>
      <h1 className="text-3xl font-bold text-white-1"> Create post</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="postTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Title..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select Post Category
              </Label>
              <Select onValueChange={(value) => setPostCategory(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
                  )}
                >
                  <SelectValue
                    placeholder="Select Post Category"
                    className="placeholder:text-gray-1"
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {postCategories.map((category) => {
                    return (
                      <SelectItem
                        className="capitalize focus:bg-orange-1"
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
                {/* {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  ></audio>
                )} */}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="postDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short post description"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePost
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              postCategory={postCategories}
              audio={audioUrl}
              postContent={postContent}
              setPostContent={setPostContent}
            //   setAudioDuration={setAudioDuration}
            ></GeneratePost>
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            ></GenerateThumbnail>
          </div>
          <div className="mt-10 w-full">
            <Button
              type="submit"
              className="text-16 h-20 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="animate-spin ml-2"></Loader>
                  Submitting
                </>
              ) : (
                "Submit & Publish post"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
