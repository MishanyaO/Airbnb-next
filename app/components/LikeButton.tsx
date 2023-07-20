"use client";

import { FC } from "react";
import { SafeUser } from "../types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "../hooks/useFavorite";

interface Props {
  listingId: string;
  currentUser?: SafeUser | null;
}

const LikeButton: FC<Props> = ({ listingId, currentUser }) => {
  const { handleFavorite, hasFavorited } = useFavorite({
    listingId,
    currentUser,
  });

  return (
    <div
      onClick={handleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        className="fill-white absolute -top-[2px] -right-[2px]"
        size={28}
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default LikeButton;
