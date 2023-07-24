"use client";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/Navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import { Range } from "react-date-range";
import { toast } from "react-hot-toast";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface Props {
  currentUser?: SafeUser | null;
  listing: SafeListing & {
    user: SafeUser;
  };
  reservations?: SafeReservation[];
}

const ListingClient: FC<Props> = ({
  listing,
  currentUser,
  reservations = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState(listing.price);

  const loginModal = useLoginModal();
  const router = useRouter();

  const handleCreateReservation = useCallback(() => {
    if (!currentUser) return loginModal.onOpen();

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("Booked successfully!", {
          style: {
            background: "#b6ffbf",
            color: "black",
          },
        });
        setDateRange(initialDateRange);
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser, dateRange, listing?.id, loginModal, router, totalPrice]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={handleCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
