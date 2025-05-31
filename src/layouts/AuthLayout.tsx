import PageLoader from "@/components/ui/loading/PageLoader";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AuthLayout = ({ children }: any) => {
  const {
    userStore: { user, userLoading },
  } = useStore();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const dependencyArray = [user, userLoading];

  if (user) {
    dependencyArray.push(user);
  }

  useEffect(() => {
    if (userLoading) return;

    if (user == null) {
      sessionStorage.setItem("redirect", router.asPath);
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
  }, dependencyArray);

  if (userLoading || loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default observer(AuthLayout);
