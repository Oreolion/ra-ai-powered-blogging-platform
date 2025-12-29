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
import { Loader, X } from "lucide-react"; // Added X icon for removing tags
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  postTitle: z.string().min(2, "Title must be at least 2 characters"),
  postDescription: z
    .string()
    .min(2, "Description must be at least 2 characters"),
});

export default function AddBlogPost() {
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  
  // CHANGED: Managing categories as an array in state for the UI
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const createPost = useMutation(api.posts.createPost);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postTitle: "",
      postDescription: "",
    },
  });

  // Helper: Add category to list
  const handleCategoryChange = (value: string) => {
    if (!selectedCategories.includes(value)) {
      setSelectedCategories((prev) => [...prev, value]);
    }
  };

  // Helper: Remove category from list
  const removeCategory = (categoryToRemove: string) => {
    setSelectedCategories((prev) =>
      prev.filter((category) => category !== categoryToRemove)
    );
  };

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Validation: Check if array has items
      if (!postContent || !imageUrl || selectedCategories.length === 0) {
        toast({
          title: "Please Create Post",
          variant: "destructive",
        });
        setIsSubmitting(false);
        throw new Error("Please Create Post and Add Thumbnail");
      }

      await createPost({
        postTitle: data.postTitle,
        postDescription: data.postDescription,
        postContent,
        // CHANGED: Convert array to string (e.g. "Tech, AI") to match DB string schema
        postCategory: selectedCategories.join(", "), 
        imageUrl,
        imagePrompt,
        views: 0,
        likes: 0,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast({
        title: "Post Created Successfully",
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

  const postCategories = [
    "Technology",
    "Metaphysics & Esoterics",
    "Science",
    "World News",
    "Africa",
    "Programming",
    "Politics",
    "Machine Learning",
    "Artificial Intelligence",
    "Economics & Finance",
    "Self Development",
    "Others",
  ];

  return (
    <section className={styles.bloginput__box}>
      <h1 className="text-3xl font-bold text-gray-200 max-sm:text-2xl">
        {" "}
        Create post
      </h1>
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
                  <FormLabel className="text-16 font-bold text-gray-200">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Title..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-gray-200">
                Select Post Category
              </Label>
              
              {/* Display Selected Categories */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.map((category) => (
                        <div key={category} data-testid={`category-chip-${category}`} className="flex items-center gap-2 bg-black-1 border border-orange-1/50 px-3 py-1 rounded-full text-xs text-gray-1">
                            {category}
                            <X 
                                className="w-3 h-3 cursor-pointer hover:text-orange-1" 
                                onClick={() => removeCategory(category)}
                            />
                        </div>
                    ))}
                </div>
              )}

              {/* Select Dropdown acting as an 'Adder' */}
              <Select onValueChange={(value) => handleCategoryChange(value)}>
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
                <SelectContent className="text-16 border-none bg-slate-700 font-bold text-gray-200 focus:ring-orange-1">
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
              </Select>
            </div>

            <FormField
              control={form.control}
              name="postDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-gray-200">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short post description"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePost
              //   postDescription={postDescription}
              setAudio={setAudioUrl}
              postCategory={postCategories}
              postContent={postContent}
              setPostContent={setPostContent}
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
              className="text-16 h-20 w-full bg-orange-1 py-4 font-extrabold text-gray-200 transition-all duration-500 hover:bg-black-1"
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