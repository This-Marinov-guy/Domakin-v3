import React, { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    window.close();
  }, []);

  return <div>Completing sign in...</div>;
}
