"use client";
import Image, { StaticImageData } from "next/image";
import Slider from "react-slick";

import brandLogo_1 from "@/assets/img/partners/2.png";
import brandLogo_2 from "@/assets/img/partners/1.png";
import brandLogo_3 from "@/assets/img/partners/3.png";
import brandLogo_4 from "@/assets/img/partners/4.png";
import brandLogo_5 from "@/assets/img/partners/5.png";
import brandLogo_6 from "@/assets/img/partners/6.png";
import brandLogo_7 from "@/assets/img/partners/7.svg";
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
  // {
  //   logo: brandLogo_7,
  //   link: "https://rentbird.nl/nl?awc=69422_1753473177_c3306255d6ee00504907264fad72346f&sv1=affiliate&sv_campaign_id=220921&utm_id=220921",
  // },
];

const BrandTwo = () => {
  return (
    <div className="row g-4 justify-content-center align-items-center">
      {brand_data.map((brand, i) => (
        <div
          key={i}
          className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-3"
        >
          <Link
            href={brand.link}
            target="_blank"
            rel="noopener noreferrer"
            className="d-block text-center p-3 h-100 d-flex align-items-center justify-content-center brand-item"
            style={{
              minHeight: '120px',
              transition: 'all 0.3s ease',
              borderRadius: '12px',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Image
              height={80}
              width={160}
              src={brand.logo}
              className={`img-fluid ${i === 1 ? "cool-travel" : ""}`}
              alt={`Brand logo ${i + 1}`}
              style={{
                maxHeight: '80px',
                objectFit: 'contain',
                filter: 'grayscale(0%)',
                transition: 'filter 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'grayscale(0%) brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'grayscale(0%)';
              }}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BrandTwo;
