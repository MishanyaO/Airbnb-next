"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeReservation, SafeUser } from "../types";

interface Props {
  currentUser?: SafeUser | null;
  reservations: SafeReservation[];
}

const TripsClient: FC<Props> = ({ currentUser, reservations }) => {
  const [deletingId, setDeletingId] = useState("");

  const router = useRouter();
  const handleCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled!", {
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
      <Heading
        title="Trips"
        subtitle="Where you've been and where you are going"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            //@ts-expect-error
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={handleCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;
