import PageLoader from "@/components/ui/loading/PageLoader";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthLayout = ({ children }: any) => {
  const {
    userStore: { user, userLoading },
  } = useStore();

  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      router.push(
        {
          pathname: "/",
          query: { login: 1 },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [user, router]);

  if (userLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default observer(AuthLayout);
