import React from 'react';
import { Share2 } from "lucide-react";


interface ShareProps {
  onOpenModal: () => void;
}

export const Share: React.FC<ShareProps> = ({ onOpenModal }) => {
  return (
    <div onClick={onOpenModal} className="cursor-pointer mb-3">
      <Share2 size={24} color={'#2b7810'}/>
    </div>
  );
};