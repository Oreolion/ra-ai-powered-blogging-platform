"use client";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import styles from "@/styles/homefeeds.module.css";
import Like from "@/components/post-actions/Like";
import HomeCard from "@/components/HomeCard";
import { PostComments } from "@/components/PostComments";
import Delete from "@/components/post-actions/Delete";
import { CopyLink } from "@/components/post-actions/CopyLink";
import Saved from "@/components/post-actions/Saved";
import Comment from "@/components/post-actions/Comment";
import { Share } from "@/components/post-actions/Share";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareModal from "@/components/ShareModal";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import html2canvas from "html2canvas";
const PostDetails = ({
  params: { postId },
}: {
  params: { postId: Id<"posts"> };
}) => {
  const [toggleComment, setToggleComment] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [summaryImageUrl, setSummaryImageUrl] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSummaryReady, setIsSummaryReady] = useState<boolean>(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const summarizePost = useAction(api.openai.summarizePostAction);
  const { toast } = useToast();
  const { user } = useUser();

  const post = useQuery(api.posts.getPostById, {
    postId: postId,
  });
  const postComments = useQuery(api.posts.getComments, {
    // @ts-ignore
    postId,
  });

  const similarPosts = useQuery(api.posts.getPostByPostCategory, {
    postId: postId,
  });
  const updatePostSummaryImage = useMutation(api.posts.saveSummaryImage);

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.posts.getUrl);

  const formatDate = (creationTime: number) => {
    const date = new Date(Math.floor(creationTime));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!similarPosts || !post) return <LoaderSpinner></LoaderSpinner>;

  if (!postId) {
    return <LoaderSpinner />;
  }

  const handleToggleCommentBox = () => {
    setToggleComment(!toggleComment);
  };

  const handleSummarize = async () => {
    setIsGenerating(true);
    try {
      // Generate summary
      const response = await summarizePost({
        title: post?.postTitle,
        content: post?.postContent,
      });
      // Validate the response
      if (!response || typeof response !== "string" || response.trim() === "") {
        throw new Error("Invalid summary response from OpenAI");
      }

      console.log(response);
      setSummary(response);
      console.log(summary);
      setIsSummaryReady(true);

      if (summaryRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const canvas = await html2canvas(summaryRef.current, {
          scale: 2,
          backgroundColor: "#f8f8f8",
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowWidth: 1200,
          windowHeight: summaryRef.current.scrollHeight,
        });

        canvas.toBlob(
          async (blob) => {
            console.log(blob);
            if (blob) {
              try {
                setIsUploading(true);

                // Convert blob to File object
                const file = new File([blob], "summary.png", {
                  type: "image/png",
                });

                console.log(file);

                // Upload using uploadstuff
                const uploaded = await startUpload([file]);
                const storageId = (uploaded[0].response as any).storageId;

                if (!storageId) {
                  throw new Error("Failed to upload image");
                }

                // Get the URL for the uploaded image
                const summaryUrl = await getImageUrl({ storageId });

                console.log(storageId);
                console.log(summaryUrl);

                if (!summaryUrl) {
                  throw new Error("Failed to get image URL");
                }

                await updatePostSummaryImage({
                  postId: postId,
                  summaryImageUrl: summaryUrl,
                  summaryImageStorageId: storageId,
                });

                setIsSaved(true);
                setSummaryImageUrl(summaryUrl);
                console.log(summaryImageUrl);

                toast({
                  title: "Success!",
                  description:
                    "Summary has been generated and saved. You can now download it.",
                });
              } catch (error) {
                console.error("Error saving image:", error);
                toast({
                  title: "Error",
                  description:
                    "Failed to save the summary image. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setIsUploading(false);
              }
            }
          },
          "image/png",
          1.0
        );
      }
    } catch (error) {
      console.error("Error summarizing post:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (summaryRef.current) {
      try {
        const canvas = await html2canvas(summaryRef.current, {
          scale: 2,
          backgroundColor: "#f8f8f8",
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowWidth: 1200,
          windowHeight: summaryRef.current.scrollHeight,
        });

        // Create download link for the user
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0)
        );

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${post?.postTitle?.slice(0, 30)}-summary.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        toast({
          title: "Success!",
          description: "Summary image has been downloaded.",
        });
      } catch (error) {
        console.error("Error downloading image:", error);
        toast({
          title: "Error",
          description: "Failed to download the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const SummaryTemplate = () => (
    <div
      ref={summaryRef}
      className="mx-auto bg-gray-50 p-8 rounded-lg shadow-lg mb-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post?.postTitle}
          </h1>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {formatDate(post?._creationTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
          {summary.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 flex justify-between items-center text-sm text-gray-500">
          <span>{post?.author}</span>
          <span className="flex items-center gap-2">
            <Badge variant="secondary">{post?.postCategory}</Badge>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="ml-[7rem] mt-[9rem] max-md:ml-[-1rem]">
      <article className={`${styles.post} ${styles.postdetails}`}>
        <div className={styles.user__profile}>
          <Link href={`/profile/${user?.id}`} className={styles.user__image}>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={post.authorImageUrl || "/placeholder-avatar.jpg"}
                alt={post.author}
              />
              <AvatarFallback>{post.author?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className={styles.user__info}>
            <div className="flex items-center justify-between">
              <Link href={`/profile/${user?.id}`} className={styles.username}>
                {post.author}
              </Link>
              <div className="flex items-center text-sm text-gray-500 ml-10">
                <CalendarIcon className="mr-1 h-6 w-6" />
                <time dateTime={new Date(post._creationTime).toISOString()}>
                  {formatDate(post._creationTime)}
                </time>
              </div>
            </div>

            <Badge className="mb-4 h-8 min-w-[7rem] max-w-[11rem]">
              {post.postCategory}
            </Badge>
          </div>
        </div>

        <div className={styles.postheader}>
          <h2 className={styles.h2}> {post?.postTitle} </h2>
          <p className={styles.desc}> {post?.postDescription} </p>
        </div>
        <div className={styles.postimage}>
          <Image src={post?.imageUrl} alt="thumbnail" width={230} height={46} />
        </div>
        <p
          className={`${styles.p} prose prose-li:marker:text-green-500 prose-img:rounded-lg prose-headings:underline prose-a:text-blue-600 lg:prose-xl`}
        >
          {" "}
          {post?.postContent}{" "}
        </p>

        <div className="text-center mb-4">
          {!isSummaryReady ? (
            <Button
              variant="secondary"
              onClick={handleSummarize}
              disabled={isGenerating || isUploading}
              className="w-64 mb-4"
            >
              {isGenerating ? (
                <>
                  <LoaderSpinner />
                  {isUploading ? "Saving Summary..." : "Generating Summary..."}
                </>
              ) : (
                "Generate Summary with AI"
              )}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={!isSaved}
              className="w-64 mb-4"
            >
              {!isSaved ? "Saving Summary..." : "Download Summary as Image"}
            </Button>
          )}

          {isSummaryReady && <SummaryTemplate />}
        </div>

        <div className={styles.reactionbox}>
          <div className={styles.left}>
            <div className={styles.user}>
              <Image
                src="/images/icons8-views-64.png"
                alt="views"
                width={30}
                height={30}
              />
              <span className={styles.span}>{post?.views} </span>
            </div>
          </div>
          <div className={styles.right}>
            <Saved post={post} audioStorageId={post?.audioStorageId}></Saved>
            <Delete
              postId={post?._id}
              imageStorageId={post?.imageStorageId}
              audioStorageId={post?.audioStorageId}
            ></Delete>
            <CopyLink></CopyLink>
            <Share onOpenModal={() => setIsShareModalOpen(true)} />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              postUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/post/${postId}`}
              postTitle={post?.postTitle}
            />
            <div
              onClick={handleToggleCommentBox}
              className={`${styles.icon} mt-[-4px]`}
            >
              <Comment></Comment>
              <span className="ml-4">{postComments?.length} </span>
            </div>

            <Like likes={post?.likes} postId={post._id}></Like>
          </div>
        </div>
        {toggleComment && <PostComments postId={postId}></PostComments>}
      </article>

      <section className="mt-8 flex flex-col gap-5 ml-[-1rem]">
        <h1 className="text-[1.8rem] font-bold text-gray-400 max-sm:text-[1.3rem]">Similar Posts</h1>
        {similarPosts && similarPosts.length > 0 ? (
          <div className="">
            {similarPosts?.map(
              ({
                _id: postId,
                views,
                likes,
                postCategory,
                postTitle,
                postDescription,
                postContent,
                authorImageUrl,
                imageUrl,
                author,
                _creationTime,
              }) => {
                return (
                  <HomeCard
                    key={postId}
                    imageUrl={imageUrl!}
                    title={postTitle!}
                    description={postDescription}
                    category={postCategory}
                    content={postContent}
                    postId={postId}
                    views={views}
                    likes={likes}
                    author={author}
                    authorImageUrl={authorImageUrl}
                    _creationTime={_creationTime}
                  />
                );
              }
            )}
          </div>
        ) : (
          <>
            <EmptyStates
              title="No Similar post Found"
              buttonLink="/dashboard"
              buttonText="Discover more posts"
            ></EmptyStates>
          </>
        )}
      </section>
    </section>
  );
};

export default PostDetails;
