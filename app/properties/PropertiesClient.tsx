"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";

interface Props {
  currentUser?: SafeUser | null;
  listings: SafeListing[];
}

const PropertiesClient: FC<Props> = ({ currentUser, listings }) => {
  const [deletingId, setDeletingId] = useState("");

  const router = useRouter();
  const handleCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`api/listings/${id}`)
        .then(() => {
          toast.success("Property removed", {
            style: {
              background: "#b6ffbf",
              color: "black",
            },
          });
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading title="Properties" subtitle="List of your properties" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={handleCancel}
            disabled={deletingId === listing.id}
            actionLabel="Remove property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
