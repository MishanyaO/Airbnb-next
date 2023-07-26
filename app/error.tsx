"use client";

import { FC, useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface Props {
  error: Error;
}

const ErrorState: FC<Props> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <EmptyState title="Ooops..." subtitle="Something went wrong!" />;
};

export default ErrorState;
