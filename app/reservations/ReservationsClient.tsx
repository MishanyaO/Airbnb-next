"use client";

import { FC, useCallback, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

import { SafeReservation, SafeUser } from "../types";

interface Props {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const ReservationsClient: FC<Props> = ({ reservations, currentUser }) => {
  const [deletingId, setDeletingId] = useState("");
  const router = useRouter();

  const handleCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios
      .delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success("Reservation cancelled", {
          style: {
            background: "#b6ffbf",
            color: "black",
          },
        });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setDeletingId(""));
  }, []);

  return (
    <Container>
      <Heading title="Reservations" subtitle="Bookings on your properties" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={handleCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
            hideLikeBtn
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;