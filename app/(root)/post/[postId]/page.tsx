"use client";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery, useAction } from "convex/react";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { marked } from "marked";
import DOMPurify from "dompurify";

const PostDetails = ({
  params: { postId },
}: {
  params: { postId: Id<"posts"> };
}) => {
  const [toggleComment, setToggleComment] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummaryReady, setIsSummaryReady] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const summaryRef = useRef(null);
  const summarizePost = useAction(api.openai.summarizePostAction);
  const saveSummary = useMutation(api.posts.saveSummary);
  const { toast } = useToast();
  const { user } = useUser();

  const post = useQuery(api.posts.getPostById, { postId });
  const postComments = useQuery(api.posts.getComments, { postId });
  const similarPosts = useQuery(api.posts.getPostByPostCategory, { postId });


  useEffect(() => {
    if (post && post.summary && !summary) {
      setSummary(post.summary);
      setIsSummaryReady(true);
      setIsSaved(true);
    }
  }, [post, summary]);

  // Parse and sanitize Markdown content
  useEffect(() => {
    if (post?.postContent) {
      const rawHtml = marked(post.postContent);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtmlContent(sanitizedHtml);
    }
  }, [post]);

  const formatDate = (creationTime) => {
    const date = new Date(Math.floor(creationTime));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!similarPosts || !post) return <LoaderSpinner />;

  if (!postId) return <LoaderSpinner />;

  const handleToggleCommentBox = () => {
    setToggleComment(!toggleComment);
  };

  const handleSummarize = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate a summary.",
        // variant: "warning",
      });
      return;
    }

    if (summary) {
      toast({
        title: "Summary Already Exists",
        description: "A summary has already been generated for this post.",
      });
      return;
    }

    if (!post?.postContent) {
      toast({
        title: "No Content",
        description: "Post content is missing.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let summaryText = "";

      if (post.postContent.length < 800) {
        summaryText = post.postContent;
        toast({
          title: "Summary Set to Original Content",
          description:
            "Post content is less than 800 characters. Using original content as summary.",
        });
      } else {
        const response = await summarizePost({
          title: post.postTitle,
          content: post.postContent,
        });

        if (!response || typeof response !== "string" || response.trim() === "") {
          throw new Error("Invalid summary response from OpenAI");
        }

        summaryText = response;
      }

      setSummary(summaryText);
      setIsSummaryReady(true);

      await saveSummary({ postId, summary: summaryText });

      setIsSaved(true);

      toast({
        title: "Success!",
        description: "Summary has been generated and saved.",
      });
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
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to download the summary image.",
        // variant: "warning",
      });
      return;
    }

    if (summaryRef.current) {
      try {
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

        const blob = await new Promise((resolve) =>
          canvas.toBlob((blob) => resolve(blob), "image/png", 1.0)
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
    } else {
      toast({
        title: "Error",
        description: "No summary available to download.",
        variant: "destructive",
      });
    }
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const SummaryTemplate = () => (
    <div
      ref={summaryRef}
      className={`mx-auto p-8 rounded-lg shadow-lg mb-6 msm:mx-[.5rem] ${
        isDarkTheme ? "bg-black text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div
          className={`border-b pb-6 ${
            isDarkTheme ? "border-gray-700 text-gray-200" : "border-gray-200"
          }`}
        >
          <h1 className="font-mono text-5xl font-bold mb-4 sm:text-[2.5rem] ssm:text-[2rem]">
            {post?.postTitle}
          </h1>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm">{formatDate(post?._creationTime)}</p>
            </div>
          </div>
        </div>

        {/* Summary Content */}
        <div
          className={`prose prose-lg max-w-none ${
            isDarkTheme ? "text-gray-200" : "text-black"
          }`}
        >
          {summary}
        </div>

        {/* Footer */}
        <div
          className={`border-t pt-6 flex justify-between items-center text-sm ${
            isDarkTheme ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <span>@{post?.author}</span>
          <span className="flex items-center gap-2">
            <Badge variant="secondary">{post?.postCategory}</Badge>
            <Badge variant="secondary">Created @ THE RA APP</Badge>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="ml-[7rem] mt-[9rem] max-md:ml-[0rem]">
      <article className={`${styles.post} ${styles.postdetails}`}>
        {/* Post Header */}
        <div className={styles.user__profile}>
          <Link
            href={`/profile/${post?.authorId || ""}`}
            className={styles.user__image}
          >
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
              <Link
                href={`/profile/${post?.authorId || ""}`}
                className={styles.username}
              >
                {post.author}
              </Link>
              <div className="flex items-center text-sm text-gray-500 ml-10 max-sm:ml-6">
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

        {/* Post Content */}
        <div className={styles.postheader}>
          <h2 className={styles.h2}>{post?.postTitle}</h2>
          <p className={styles.desc}>{post?.postDescription}</p>
        </div>
        <div className={styles.postimage}>
          {post?.imageUrl && (
            <Image
              src={post.imageUrl}
              alt="thumbnail"
              width={230}
              height={46}
            />
          )}
        </div>
        <div
          className={`${styles.p} prose prose-li:marker:text-green-500 prose-img:rounded-lg prose-headings:underline prose-a:text-blue-600 lg:prose-xl`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>

        {/* Summary Generation and Download */}
        <div className="text-center mb-4">
          {!isSummaryReady ? (
            <Button
              variant="secondary"
              onClick={handleSummarize}
              disabled={isGenerating}
              className="w-64 mb-4"
            >
              {isGenerating
                ? "Generating Summary..."
                : "Generate Summary with AI"}
            </Button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-4 max-md:flex-col">
                <Button
                  variant="secondary"
                  onClick={handleDownload}
                  className="w-64"
                >
                  Download Summary as Image
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleThemeToggle}
                  className="w-64"
                >
                  Switch to {isDarkTheme ? "Light" : "Dark"} Theme
                </Button>
              </div>
              <SummaryTemplate />
            </div>
          )}
        </div>

        {/* Post Reactions */}
        <div className={styles.reactionbox}>
          <div className={styles.left}>
            <div className={styles.user}>
              <Image
                src="/images/icons8-views-64.png"
                alt="views"
                width={30}
                height={30}
              />
              <span className={styles.span}>{post?.views}</span>
            </div>
          </div>
          <div className={styles.right}>
            {user ? (
              <>
                <Saved post={post} audioStorageId={post?.audioStorageId} />
                <Delete
                  postId={post?._id}
                  imageStorageId={post?.imageStorageId}
                  audioStorageId={post?.audioStorageId}
                />
                <CopyLink />
                <Share onOpenModal={() => setIsShareModalOpen(true)} />
                <ShareModal
                  isOpen={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                  postUrl={`${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }/post/${postId}`}
                  postTitle={post?.postTitle}
                />
                <div
                  onClick={handleToggleCommentBox}
                  className={`${styles.icon} mt-[-4px]`}
                >
                  <Comment />
                  <span className="ml-2">{postComments?.length}</span>
                </div>
                <Like likes={post?.likes} postId={post._id} />
              </>
            ) : (
              <p className="text-gray-500">
                Sign in to interact with this post.
              </p>
            )}
          </div>
        </div>

        {toggleComment && user && <PostComments postId={postId} />}
      </article>

      {/* Similar Posts */}
      <section className="mt-8 flex flex-col gap-5 ml-[-1rem]">
        <h1 className="text-[1.8rem] font-bold text-gray-400 max-sm:text-[1.3rem]">
          Similar Posts
        </h1>
        {similarPosts && similarPosts.length > 0 ? (
          <div>
            {similarPosts.map((similarPost) => (
              <HomeCard
                key={similarPost._id}
                imageUrl={similarPost.imageUrl}
                title={similarPost.postTitle}
                description={similarPost.postDescription}
                category={similarPost.postCategory}
                content={similarPost.postContent}
                postId={similarPost._id}
                views={similarPost.views}
                likes={similarPost.likes}
                author={similarPost.author}
                authorImageUrl={similarPost.authorImageUrl}
                _creationTime={similarPost._creationTime}
              />
            ))}
          </div>
        ) : (
          <EmptyStates
            title="No Similar Posts Found"
            buttonLink="/dashboard"
            buttonText="Discover more posts"
          />
        )}
      </section>
    </section>
  );
};

export default PostDetails;
