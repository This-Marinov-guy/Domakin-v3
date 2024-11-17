"use client";
import Image, { StaticImageData } from "next/image";
import Slider from "react-slick";

import brandLogo_1 from "@/assets/img/partners/2.png";
import brandLogo_2 from "@/assets/img/partners/1.png";
import brandLogo_3 from "@/assets/img/partners/3.png";
import brandLogo_4 from "@/assets/img/partners/4.png";
import brandLogo_5 from "@/assets/img/partners/5.png";
import brandLogo_6 from "@/assets/img/partners/6.png";
import Link from "next/link";

const brand_data: any[] = [
  {
    logo: brandLogo_1,
    link: "https://www.bulgariansociety.nl/",
  },
  {
    logo: brandLogo_2,
    link: "https://www.cooltravel.bg/",
  },
  {
    logo: brandLogo_3,
    link: "https://studybuddy.bg/",
  },
  {
    logo: brandLogo_4,
    link: "https://www.unify.bg/",
  },
  {
    logo: brandLogo_5,
    link: "https://www.bghub-eindhoven.nl/",
  },
  {
    logo: brandLogo_6,
    link: "https://www.integral.bg/",
  },
];

const BrandTwo = () => {
  return (
    <div className="row">
      {brand_data.map((brand, i) => (
        <Link
          href={brand.link}
          target="_blank"
          key={i}
          className={"col-lg-2 col-md-3 col-4 item d-flex align-items-center "}
        >
          <Image
            height={100}
            width={200}
            src={brand.logo}
            className={i === 1 ? "cool-travel" : ""}
            alt="brand"
          />
        </Link>
      ))}
    </div>
  );
};

export default BrandTwo;
