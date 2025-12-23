"use client";
import Link from "next/link";
import Image from "next/image";
import UseSticky from "@/hooks/UseSticky";
import logoTransparentWhite from "@/assets/img/logo-transparent-white.png";

export default function HeaderV2 ({ style }: any) {
  const { sticky } = UseSticky();

  return (
    <header className={`theme-main-menu menu-style-one sticky-menu header-v2 ${sticky && "fixed"}`}>
      <div className="inner-content px-10">
        <div className="top-header position-relative">
          <div className="d-flex align-items-center justify-content-center">
              <Link href="/" className="logo-v2" scroll={false}>
                <Image src={logoTransparentWhite} alt="" />
              </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
