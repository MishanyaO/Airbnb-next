"use client";

import { FC } from "react";
import { SafeUser } from "../types";

interface Props {
  listingId?: string;
  currentUser?: SafeUser | null;
}

const LikeButton: FC<Props> = ({ listingId, currentUser }) => {
  return <div>LikeButton</div>;
};

export default LikeButton;
