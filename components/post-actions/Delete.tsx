import { useUser } from '@clerk/nextjs';
import React from 'react'
import { MdOutlineDeleteOutline } from "react-icons/md";

const Delete = () => {
    const { user } = useUser();


    const handleDelete = () => {

    }

  return (
    <div className="flex gap-1.5 items-center" onClick={handleDelete}>
    <MdOutlineDeleteOutline
      size={20}
      className=" opacity-70  cursor-pointer hover:fill-[red]"
    />
  </div>
  )
}

export default Delete