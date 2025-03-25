import React, { useEffect, useState } from "react";
import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo";
import FooterFour from "@/layouts/footers/FooterFour";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FancyBanner from "@/components/common/FancyBanner";
import useTranslation from "next-translate/useTranslation";
import BlogMainSection from "@/components/blogs/common-blog/BlogMainSection";
import Link from "next/link";
import { useServer } from "@/hooks/useServer";
import PageLoader from "@/components/ui/loading/PageLoader";
import { useRouter } from "next/router";
import { showGeneralError } from "@/utils/helpers";

const NewsletterUnsubscribe = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation("translations");
  const { sendRequest } = useServer();
  const router = useRouter();

  useEffect(() => {
    if (!router.query.email || !router.query.id) {
      return
        // showGeneralError(t("api.general_error"));
    }

    sendRequest("/common/newsletter/unsubscribe", "DELETE", {
      email: router.query.email,
      id: router.query.id,
    })
      .then((response) => {
        if (response?.status) {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        showGeneralError(t("api.general_error"));
      });
  }, [router.query.email, router.query.id]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <HeaderOne />
      <div className="flex items-center justify-center min-h-screen mt-200">
        <div className="text-center">
          <h3>{t("unsubscribe_email.title")}</h3>
          <p>{t("unsubscribe_email.description")}</p>
          <Link
            href="/"
            className="m-a mt-20 btn-five sm fw-normal text-uppercase "
          >
            {t("error.back_to_home")}
          </Link>
        </div>
      </div>
      <FooterFour />
    </>
  );
};

export default NewsletterUnsubscribe;
