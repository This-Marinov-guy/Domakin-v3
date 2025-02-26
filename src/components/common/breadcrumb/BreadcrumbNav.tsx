"use client";
import NiceSelect from "@/ui/NiceSelect";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";

const BreadcrumbNav = ({ link_title, sub_title }: any) => {
  const { t } = useTranslation("translations");
  const router = useRouter();

  return (
    <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bg-white p-2 rounded-3 flex gap-2">
      <li onClick={() => router.back()} style={{ color: "black" }}>
        <i className="hover-orange fa-solid fa-arrow-left"></i>
      </li>
      <li>/</li>
      <li>
        <Link href="/">{t("header.home")}</Link>
      </li>
      <li>/</li>
      <li>{link_title}</li>
      {sub_title && (
        <>
          <li>/</li>
          <li>{sub_title}</li>
        </>
      )}
    </ul>
  );
};

export default BreadcrumbNav;
