import { HiLink } from "react-icons/hi";
import { useToast } from "../ui/use-toast";

export const CopyLink = () => {
  const path = window.location.href;
  const { toast } = useToast();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(path);
      toast({
        title: "Post Link Copied successfully",
      });
    } catch (error) {
      toast({
        title: "Post Link Copied successfully",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-1.5 items-center mt-[-1rem]" onClick={copyLink}>
      <HiLink
        size={30}
        opacity={0.5}
        className="hover:opacity-100 cursor-pointer"
      />
    </div>
  );
};
