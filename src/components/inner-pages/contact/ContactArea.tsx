import Link from "next/link";
import Image from "next/image";

import emailIcon from "@/assets/images/icon/mail.svg";
import phoneIcon from "@/assets/images/icon/phone.svg";

import ContactForm from "@/components/forms/ContactForm";
import useTranslation from "next-translate/useTranslation";
import {
  ADDRESS,
  EMAIL,
  FACEBOOK,
  INSTAGRAM,
  LINKEDIN,
  PHONE,
  PHONE_NUMBER,
} from "@/utils/defines";
import { logoByTheme } from "@/utils/config";

interface DataType {
  id: number;
  icon?: any;
  forceIcon?: string;
  class_name?: string;
  title: string;
  link?: string;
  address_1: string;
  address_2?: string;
}

const address_data: DataType[] = [
  {
    id: 1,
    icon: emailIcon,
    title: "contact.email",
    address_1: EMAIL,
    link: "mailto:" + EMAIL,
  },
  {
    id: 2,
    icon: phoneIcon,
    title: "contact.telephone",
    address_1: PHONE_NUMBER,
    link: "tel:" + PHONE_NUMBER,
  },
  {
    id: 3,
    forceIcon: "fa-brands fa-instagram",
    title: "Instagram",
    address_1: "domakin.nl",
    link: INSTAGRAM,
  },
  {
    id: 4,
    forceIcon: "fa-brands fa-linkedin",
    title: "LinkedIn",
    address_1: "Domakin",
    link: LINKEDIN,
  },
  // {
  //   id: 5,
  //   forceIcon: "fa-brands fa-facebook",
  //   title: "Facebook",
  //   address_1: "Domakin",
  //   link: FACEBOOK,
  // },
  // {
  //   id: 2,
  //   icon: locationIcon,
  //   class_name: "skew-line",
  //   title: "contact.office_address",
  //   address_1: ADDRESS,
  // },
  // {
  //   id: 2,
  //   icon: locationIcon,
  //   title: "contact.telephone",
  //   address_1: PHONE,
  // },
];

const ContactArea = () => {
  const { t } = useTranslation("translations");

  return (
    <div style={{width: '97vw'}} className="contact-us border-top pt-60">
      {/* <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8 col-lg-10 m-auto">
            <div className="title-one text-center wow fadeInUp">
              <h3>{t("contact.contact_us")}</h3>
            </div>
          </div>
        </div>
      </div> */}

      <div className="address-banner wow fadeInUp mt-60 lg-mt-40">
        <div className="row d-flex justify-content-center">
          {address_data.map((item) => (
            <Link
              href={item.link ?? "#"}
              target="_blank"
              key={item.id}
              className={`col-lg-2 col-md-3 col-6 mt-10 hover-blue`}
            >
              <div className="d-xl-flex align-items-center">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                  {item.forceIcon ? (
                    <i
                      style={{ color: "white", fontSize: "1.8em" }}
                      className={item.forceIcon}
                    />
                  ) : item.icon ? (
                    <Image
                      src={item.icon}
                      alt=""
                      width={28}
                      height={28}
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  ) : null}
                </div>
                <div className="text">
                  <p className="fs-22">{t(item.title)}</p>
                  <p className="tran3s">{item.address_1}</p>
                  {item.address_2 && (
                    <>
                      {" "}
                      <p className="tran3s">{item.address_2}</p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-pink mt-60">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="form-style-one wow fadeInUp">
              <ContactForm />
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 d-flex order-lg-first">
            <div className="d-flex align-items-center justify-content-center contact-map-banner w-100">
              {/* <iframe
                className="gmap_iframe h-100 w-100"
                src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=dhaka collage&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              ></iframe> */}
              <Image
                src={logoByTheme()}
                width={200}
                height={200}
                alt="Logo"
                className="lazy-img logo rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;
