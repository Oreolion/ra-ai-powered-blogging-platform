"use client";

const SkeletonLoader = () => {
  return (
    <article className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/20 animate-pulse">
      {/* Author and Date Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center overflow-hidden ring-2 ring-slate-600"></div>
          <div className="flex-1 min-w-0 space-y-2">
            {/* Author Name Placeholder */}
            <div className="h-4 w-32 rounded-full bg-slate-700/50"></div>
            {/* Date Placeholder */}
            <div className="h-3 w-24 rounded-full bg-slate-700/50"></div>
          </div>
        </div>
        {/* Category Badge Placeholder */}
        <div className="h-8 w-24 rounded-full bg-slate-700/50"></div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div>
          {/* Title Placeholder */}
          <div className="h-6 w-full rounded-full bg-slate-700/50 mb-3"></div>
          <div className="h-6 w-3/4 rounded-full bg-slate-700/50 mb-3"></div>
          {/* Description Placeholder */}
          <div className="h-4 w-full rounded-full bg-slate-700/50"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            {/* Content Text Placeholder */}
            <div className="h-4 w-full rounded-full bg-slate-700/50"></div>
            <div className="h-4 w-5/6 rounded-full bg-slate-700/50"></div>
            <div className="h-4 w-2/3 rounded-full bg-slate-700/50"></div>
          </div>
          {/* Image Placeholder */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-700/50"></div>
        </div>
      </div>

      {/* Footer Section (Likes, Views, Comments) */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-orange-500/30 border-b-2">
        <div className="flex items-center gap-6">
          {/* Views Placeholder */}
          <div className="h-5 w-12 rounded-full bg-slate-700/50"></div>
          {/* Comments Placeholder */}
          <div className="h-5 w-12 rounded-full bg-slate-700/50"></div>
        </div>
        <div className="flex items-center">
          {/* Likes Placeholder */}
          <div className="h-5 w-12 rounded-full bg-slate-700/50"></div>
        </div>
      </div>
    </article>
  );
};

export default SkeletonLoader;