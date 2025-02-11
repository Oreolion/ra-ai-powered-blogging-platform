import React, { useState } from "react";
import styles from "@/styles/homefeeds.module.css";
import { PostCardProps } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Like from "./post-actions/Like";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";

const HomeCard = ({
  imageUrl,
  views,
  likes,
  _creationTime,
  postId,
  description,
  category,
  title,
  content,
  authorImageUrl,
  author,
  authorId,
  imageStorageId,
  audioStorageId,
}: PostCardProps) => {
  const [more, setMore] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useUser();
  const postComments = useQuery(api.posts.getComments, {
    // @ts-ignore
    postId: postId ?? undefined,
  });
  const updatePostViews = useMutation(api.posts.updatePostViews);


  const handleViews = async () => {
    if (postId) {
      await updatePostViews({ postId });
      router.push(`/post/${postId}`, {
        scroll: true,
      });
    } else {
      console.error("postId is undefined");
    }
  };

  const formatDate = (creationTime: number) => {
    const date = new Date(Math.floor(creationTime));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <article className={styles.post}>
        <div className={styles.user__profile}>
          <Link href={`/profile/${user?.id}`} className={styles.user__image}>
            {!authorImageUrl ? (
              <span className={styles.span}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={styles.svg}
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </span>
            ) : (
              <Image
                src={authorImageUrl}
                alt="userpicture"
                width={23}
                height={23}
              />
            )}
          </Link>
          <div className={styles.user__info}>
            <div className="flex items-center justify-between w-full">
              <Link href={`/profile/${user?.id}`} className={styles.username}>
                {author}
              </Link>
              <div className="flex items-center text-base text-slate-200">
                <CalendarIcon className="mr-1 h-6 w-6" />
                <time dateTime={new Date(_creationTime).toISOString()}>
                  {formatDate(_creationTime)}
                </time>
              </div>
            </div>
            <div className="flex flex-col">
              <Badge className="mb-4 h-8 min-w-[7rem] max-w-[11rem]">{category}</Badge>
            </div>
          </div>
        </div>
        <div className={styles.postheader}>
          <h2 className={styles.h2}> {title} </h2>
          <p className={styles.desc}> 
          {more ? description : description.substring(0, 100)}
            {description.length > 100 && (
              <span className='text-xs font-bold text-orange-400 hover:text-orange-300' onClick={handleViews}>
                ...
              </span>
            )}
            {/* {description}  */}
            </p>
        </div>
        <div className={styles.contentbox}>
          <p className={styles.p}>
            {more ? content : content.substring(0, 150)} <br />
            {content.length > 150 && (
              <span className='text-xs font-bold text-orange-400 hover:text-orange-300' onClick={handleViews}>
                Continue reading...
              </span>
            )}
          </p>
          <div className={styles.image}>
            <Image src={imageUrl} alt="thumbnail" width={230} height={11} />
          </div>
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

              <span className={styles.span}>{views}</span>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.icon} onClick={handleViews}>
              <svg
                className={styles.svg}
                fill="#ccc"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
              </svg>
              <span>{postComments?.length} </span>
            </div>{" "}
            <div className="flex gap-2 items-center justify-center">
              <Like likes={likes} postId={postId}></Like>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default HomeCard;
