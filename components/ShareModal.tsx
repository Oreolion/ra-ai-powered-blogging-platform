import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaWhatsapp, FaXTwitter, FaFacebook, FaTiktok, FaInstagram } from 'react-icons/fa6';
import { SiThreads } from "react-icons/si";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
  postTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postUrl, postTitle }) => {
  const shareLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(`${postTitle} ${postUrl}`)}` },
    { name: 'X', icon: FaXTwitter, color: '#1DA1F2', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}` },
    { name: 'Threads', icon: SiThreads, color: '#000000', url: `https://www.threads.net/share?url=${encodeURIComponent(postUrl)}` },
    { name: 'Facebook', icon: FaFacebook, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: 'TikTok', icon: FaTiktok, color: '#000000', url: `https://www.tiktok.com/share?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}` },
    { name: 'Instagram', icon: FaInstagram, color: '#E4405F', url: `https://www.instagram.com/` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {shareLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                if (platform.name === 'Instagram') {
                  e.preventDefault();
                  alert('Instagram sharing is not directly supported. You can copy the post link and share it manually on Instagram.');
                }
              }}
            >
              <platform.icon size={32} color={platform.color} />
              <span className="mt-2 text-sm">{platform.name}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;