'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
  userID?: string; // Optional if you're using query param instead
}

const SetCookiePage = ({ userID }: Props) => {
  const searchParams = useSearchParams();
  const idFromParams = searchParams.get('userID');

  useEffect(() => {
    const finalUserID = userID || idFromParams;
    if (finalUserID) {
      // Set cookie with 7-day expiry
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);

      document.cookie = `currentloginuser=${finalUserID}; expires=${expiry.toUTCString()}; path=/`;

    }
  }, [userID, idFromParams]);

  return (
    <div></div>
  );
};

export default SetCookiePage;
