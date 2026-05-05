"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import HomeCard from "@/components/HomeCard";
import EmptyStates from "@/components/EmptyStates";
import LoaderSpinner from "@/components/LoaderSpinner";
import { BookOpen, CheckCircle } from "lucide-react";

export default function ReadingListPage() {
  const readingList = useQuery(api.posts.getReadingList);

  if (readingList === undefined) return <LoaderSpinner />;

  const unreadCount = readingList.filter((item: any) => !item.isRead).length;

  return (
    <section className="pt-24 pb-8 px-4 lg:px-8 md:pt-[8rem] max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Reading List
          </h1>
        </div>
        <p className="text-slate-300 text-lg">
          {unreadCount > 0
            ? `${unreadCount} unread article${unreadCount !== 1 ? "s" : ""} waiting for you`
            : "Your saved articles for later reading"}
        </p>
      </div>

      <div className="space-y-8">
        {readingList.length > 0 ? (
          readingList.map((item: any) => (
            <div key={item._id} className="relative">
              {item.isRead && (
                <div className="absolute -top-2 -right-2 z-10 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Read
                </div>
              )}
              <HomeCard
                imageUrl={item.imageUrl}
                title={item.postTitle}
                description={item.postDescription}
                category={item.postCategory}
                content={item.postContent}
                postId={item._id}
                views={item.views}
                likes={item.likes}
                author={item.author}
                authorImageUrl={item.authorImageUrl}
                _creationTime={item._creationTime}
              />
            </div>
          ))
        ) : (
          <EmptyStates
            title="Your reading list is empty"
            buttonLink="/dashboard"
            buttonText="Discover posts"
          />
        )}
      </div>
    </section>
  );
}
