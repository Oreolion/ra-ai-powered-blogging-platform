import { HiLink } from "react-icons/hi";

export const Share = () => {
  const path = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(path);
    //   toast.success("Post link copied");
    } catch (error) {
    //   toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex gap-1.5 items-center" onClick={copyLink}>
      <HiLink
        size={20}
        opacity={0.5}
        className="hover:opacity-100 cursor-pointer"
      />
    </div>
  );
};