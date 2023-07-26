"use client";

import { useCallback, useMemo, useState } from "react";
import useSearchModal from "@/app/hooks/useSearchModal";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Range } from "react-date-range";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Modal from "./Modal";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum Steps {
  Location = 0,
  Date = 1,
  Info = 2,
}

const SearchModal = () => {
  const [step, setStep] = useState(Steps.Location);
  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const searchModal = useSearchModal();
  const params = useSearchParams();
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]
  );

  const handleBack = () => {
    setStep((value) => value - 1);
  };

  const handleNext = () => {
    setStep((value) => value + 1);
  };

  const handleSubmit = useCallback(async () => {
    if (step !== Steps.Info) return handleNext();

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params?.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(Steps.Location);
    searchModal.onClose();

    router.push(url);
  }, [
    bathroomCount,
    dateRange,
    guestCount,
    location,
    params,
    roomCount,
    router,
    searchModal,
    step,
  ]);

  const actionLabel = useMemo(() => {
    if (step === Steps.Info) return "Search";
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === Steps.Location) return undefined;
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfect location!"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === Steps.Date) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === Steps.Info) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More information" subtitle="Find your perfect place!" />
        <Counter
          title="Guests"
          subtitle="How many guests are coming?"
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
        />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
        />
      </div>
    );
  }

  return (
    <Modal
      title="Filters"
      actionLabel={actionLabel}
      secondaryAction={step === Steps.Location ? undefined : handleBack}
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchModal;
