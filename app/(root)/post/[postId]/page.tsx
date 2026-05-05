"use client";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery, useAction } from "convex/react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { Id } from "@/convex/_generated/dataModel";
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
import { Calendar, CalendarIcon, Eye, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareModal from "@/components/ShareModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import TableOfContents from "@/components/TableOfContents";
import { calculateReadingTime, formatReadingTime } from "@/lib/readingTime";
import { Clock } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

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
  const summaryRef = useRef<HTMLDivElement>(null);
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

  const formatDate = (creationTime: number) => {
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

        if (
          !response ||
          typeof response !== "string" ||
          response.trim() === ""
        ) {
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

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png", 1.0)
        );
        if (!blob) {
          throw new Error("Canvas blob is null");
        }

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
          className={`border-b pb-6 ${isDarkTheme ? "border-gray-700 text-gray-200" : "border-gray-200"}`}
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
          className={`prose prose-lg max-w-none ${isDarkTheme ? "text-gray-200" : "text-black"}`}
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

  const readingTimeMinutes = post?.postContent
    ? calculateReadingTime(post.postContent)
    : 0;

  return (
    <>
      <ReadingProgressBar />
      <section className="ml-[3rem] mt-[9rem] max-md:ml-[0rem]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_16rem] gap-8">
            <article className={`${styles.post} ${styles.postdetails}`}>
              {/* Post Header */}
              <div className={styles.user__profile}>
                <div className="flex items-center w-full gap-3 md:gap-4">
                  {/* Avatar */}
                  <Link
                    href={`/profile/${post?.authorId || ""}`}
                    className="shrink-0"
                  >
                    <Avatar className="w-10 h-10 md:w-12 md:h-12 border border-slate-700">
                      <AvatarImage
                        src={post.authorImageUrl || "/placeholder-avatar.jpg"}
                        alt={post.author}
                      />
                      <AvatarFallback>{post.author?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>

                  {/* User Info Column */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center flex-wrap">
                      {/* Username */}
                      <Link
                        href={`/profile/${post?.authorId || ""}`}
                        className="font-bold text-slate-200 text-sm md:text-base truncate mr-2"
                      >
                        {post.author}
                      </Link>

                      {/* Date + Reading Time */}
                      <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500 ml-auto md:justify-end">
                        <span className="flex items-center gap-1">
                          <Clock className="mr-1 h-4 w-4" />
                          {formatReadingTime(readingTimeMinutes)}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4 md:h-6 md:w-6" />
                          <time dateTime={new Date(post._creationTime).toISOString()}>
                            {formatDate(post._creationTime)}
                          </time>
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <Badge className="h-6 md:h-7 text-[10px] md:text-xs px-2 min-w-fit max-w-fit bg-slate-800 text-slate-300 border-slate-700">
                        {post.postCategory}
                      </Badge>
                    </div>
                  </div>
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
                    alt={post.postTitle || "Post thumbnail"}
                    width={230}
                    height={46}
                  />
                )}
              </div>
              <div className={`${styles.p} prose prose-li:marker:text-green-500 prose-img:rounded-lg prose-headings:underline prose-a:text-blue-600 lg:prose-xl dark:prose-invert`}>
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, "")}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h2({ children }) {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return <h2 id={id}>{children}</h2>;
                    },
                    h3({ children }) {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return <h3 id={id}>{children}</h3>;
                    },
                  }}
                >
                  {post?.postContent || ""}
                </ReactMarkdown>
              </div>

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
        <div className="flex flex-col sm:flex-row items-center justify-between w-full py-6 mt-8 border-y border-orange-500 bg-slate-900/20 rounded-lg px-4 gap-4">
          {/* LEFT: View Counter */}
          <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <Image
              src="/images/icons8-views-64.png"
              alt="views"
              width={30}
              height={30}
            />
            <span className="font-mono text-sm font-semibold tracking-wide">
              {post?.views ?? 0}{" "}
              <span className="text-xs font-normal text-slate-500 ml-1">
                Views
              </span>
            </span>
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user ? (
              <>
                {/* Interaction Group */}
                <div className="flex items-center gap-1 ">
                  <Like likes={post?.likes ?? 0} postId={post._id} />
                </div>

                <div
                  onClick={handleToggleCommentBox}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <MessageCircle
                    size={25}
                    className="group-hover:stroke-2 mt-[-1rem]"
                  />
                  <span className="text-sm font-medium">
                    {postComments?.length || 0}
                  </span>
                </div>

                {/* Tools Group */}
                <div className="flex items-center gap-3">
                  <Saved post={post} audioStorageId={post.audioStorageId} />

                  <CopyLink />

                  <Share onOpenModal={() => setIsShareModalOpen(true)} />

                  <Delete
                    postId={post._id}
                    imageStorageId={post.imageStorageId}
                    audioStorageId={post.audioStorageId}
                  />
                </div>

                <ShareModal
                  isOpen={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                  postUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/post/${postId}`}
                  postTitle={post?.postTitle}
                />
              </>
            ) : (
              <p className="text-sm text-slate-500 italic">
                <Link
                  href="/sign-in"
                  className="text-orange-400 hover:underline"
                >
                  Sign in
                </Link>{" "}
                to interact
              </p>
            )}
          </div>
        </div>
        {toggleComment && user && <PostComments postId={postId} />}
      </article>

      {/* Table of Contents Sidebar */}
      <aside className="hidden lg:block">
        <TableOfContents content={post?.postContent || ""} />
      </aside>
    </div>
  </div>

  {/* Similar Posts -- outside the grid */}
</section>

<section className="ml-[3rem] mt-8 max-md:ml-[0rem] flex flex-col gap-5">
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
                likes={similarPost.likes ?? 0}
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
    </>
  );
};

export default PostDetails;
