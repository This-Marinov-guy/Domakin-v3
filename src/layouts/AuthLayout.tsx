import PageLoader from "@/components/ui/loading/PageLoader";
import { useStore } from "@/stores/storeContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AuthLayout = ({ children }: any) => {
  const {
    userStore: { user },
  } = useStore();

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(
        {
          pathname: "/",
          query: { login: 1 },
        },
        undefined,
        { shallow: true }
      );
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default AuthLayout;
