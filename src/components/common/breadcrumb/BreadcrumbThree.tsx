"use client";
import NiceSelect from "@/ui/NiceSelect";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";

const BreadcrumbThree = ({
  title,
  link,
  link_title,
  sub_title,
  style,
  background = 6,
}: any) => {
  const selectHandler = (e: any) => {};

  const { t } = useTranslation("translations");
  const router = useRouter();

  return (
    <div
      className={`inner-banner-two inner-banner position-relative ${
        style
          ? "z-1 pt-170 xl-pt-150 md-pt-130 pb-100 xl-pb-80 md-pb-50"
          : "pt-160 lg-pt-130 pb-160 xl-pb-120 md-pb-80"
      }`}
      style={{
        backgroundImage: `url(/assets/img/bg/${background}.webp)`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex flex-column align-items-center justify-content-center">
            <h3
              className={`${
                style ? "xl-mb-30 md-mb-20" : "xl-mb-20 pt-15"
              } mb-35`}
            >
              {title}
            </h3>
            <ul className="theme-breadcrumb style-none d-inline-flex align-items-center justify-content-center position-relative z-1 bottom-line">
              <li
                onClick={() => router.back()}
                style={{ color: "black" }}
              >
                <i className="hover-orange fa-solid fa-arrow-left"></i>
              </li>
              <li>/</li>
              <li >
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
          </div>
        </div>

        {style && (
          <div className="search-wrapper-one layout-one position-relative mt-80 xl-mt-50">
            <div className="bg-wrapper rounded-0 border-0">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row gx-0 align-items-center">
                  <div className="col-xl-5 col-lg-4">
                    <div className="input-box-one border-left">
                      <div className="label">Categories</div>
                      <NiceSelect
                        className="nice-select fw-normal"
                        options={[
                          { value: "apartments", text: "Buy Apartments" },
                          { value: "industrial", text: "Rent Industrial" },
                          { value: "condos", text: "Rent Condos" },
                          { value: "houses", text: "Sell Houses" },
                          { value: "villas", text: "Sell Villas" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-5">
                    <div className="input-box-one border-left">
                      <div className="label">Location</div>
                      <NiceSelect
                        className="nice-select location fw-normal"
                        options={[
                          { value: "dhaka", text: "Dhanmondi, Dhaka" },
                          { value: "germany", text: "Berlin, Germany" },
                          { value: "mexico", text: "Acapulco, Mexico" },
                          { value: "france", text: "Cannes, France" },
                          { value: "india", text: "Delhi, India" },
                          { value: "giza", text: "Giza, Egypt" },
                          { value: "cuba", text: "Havana, Cuba" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-3">
                    <div className="input-box-one text-center lg-mt-10">
                      <button className="fw-500 text-uppercase tran3s search-btn-four">
                        <span>Search</span>
                        <i className="fa-light fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreadcrumbThree;
