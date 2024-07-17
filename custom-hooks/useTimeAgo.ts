import { useState, useEffect } from "react";

export const useTimeAgo = (postCreatedAt: number): string => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const currentTime: Date = new Date();
    const postCreationTime: Date = new Date(postCreatedAt);
    const timeDifference: number =
      currentTime.getTime() - postCreationTime.getTime();

    function calculateTimeAgoText(timeDifference: number): string {
      const seconds: number = Math.floor(timeDifference / 1000);
      const minutes: number = Math.floor(seconds / 60);
      const hours: number = Math.floor(minutes / 60);
      const days: number = Math.floor(hours / 24);

      if (days > 7) {
        return postCreationTime.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } else if (days > 1) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (days === 1) {
        return "yesterday";
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
      }
    }

    const timeAgoText: string = calculateTimeAgoText(timeDifference);
    setTimeAgo(timeAgoText);

    const interval: NodeJS.Timeout = setInterval(() => {
      const newTimeAgoText: string = calculateTimeAgoText(
        new Date().getTime() - postCreationTime.getTime()
      );
      setTimeAgo(newTimeAgoText);
    }, 10000);

    return () => clearInterval(interval);
  }, [postCreatedAt]);

  return timeAgo;
};