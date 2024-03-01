"use client";

import { useState, useEffect } from "react";

import StoreModal from "../modals/StoreModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Run only in Client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null till in Server-Side to prevent Hydration Error
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProvider;
