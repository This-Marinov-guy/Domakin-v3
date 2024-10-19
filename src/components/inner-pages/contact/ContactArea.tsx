import Link from "next/link";
import Image from "next/image";

import locationIcon from "@/assets/images/icon/icon_39.svg";
import emailIcon from "@/assets/img/icons/10.png";
import phoneIcon from "@/assets/img/icons/11.png";

import logo1 from "@/assets/img/logo-2.png";
import ContactForm from "@/components/forms/ContactForm";
import useTranslation from "next-translate/useTranslation";
import { ADDRESS, EMAIL, PHONE } from "@/utils/defines";

interface DataType {
  id: number;
  icon?: string;
  class_name?: string;
  title: string;
  link?: string,
  address_1: string;
  address_2?: string;
}

const address_data: DataType[] = [
  {
    id: 1,
    icon: locationIcon,
    title: "contact.email",
    address_1: EMAIL,
    link: "mailto:" + EMAIL,
  },
  {
    id: 2,
    icon: locationIcon,
    class_name: "skew-line",
    title: "contact.office_address",
    address_1: ADDRESS,
  },
  {
    id: 2,
    icon: locationIcon,
    title: "contact.telephone",
    address_1: PHONE,
  },
];

const ContactArea = () => {
  const { t } = useTranslation("translations");

  return (
    <div className="contact-us border-top pt-200">
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8 col-lg-10 m-auto">
            <div className="title-one text-center wow fadeInUp">
              <h3>{t("contact.contact_us")}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="address-banner wow fadeInUp mt-60 lg-mt-40">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center justify-content-lg-between">
            {address_data.map((item) => (
              <div
                key={item.id}
                className={`block position-relative ${item.class_name} z-1 mt-25`}
              >
                <div className="d-xl-flex align-items-center">
                  <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <Image src={item.icon ?? ""} alt="" className="lazy-img" />
                  </div>
                  <div className="text">
                    <p className="fs-22">{t(item.title)}</p>
                    <Link href={item.link ?? "#"} className="tran3s">
                      {item.address_1}
                    </Link>
                    {item.address_2 && (
                      <>
                        {" "}
                        <Link href={item.link ?? "#"} className="tran3s">
                          {item.address_2}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-pink mt-150 xl-mt-120 md-mt-80">
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
                src={logo1}
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
