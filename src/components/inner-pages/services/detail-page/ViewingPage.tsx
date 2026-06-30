import FooterFour from "@/layouts/footers/FooterFour";
import FancyBanner from "@/components/common/FancyBanner";
import ViewingForm from "@/components/forms/ViewingForm";
import Image from "next/image";
import HeaderOne from "@/layouts/headers/HeaderOne";
import RatingStars from "@/assets/images/icon/stars.svg";

const ViewingHeroTrust = () => (
  <section className="viewing-hero-trust" aria-label="Domakin student trust">
    <div className="container">
      <div className="viewing-hero-rating">
        <Image src={RatingStars} alt="ratings" priority />
        <p>
          Trusted by <span>500+</span> Students
        </p>
      </div>
    </div>
  </section>
);

const ViewingPage = () => (
  <div className="viewing-page-screenshot-shell">
    <div className="viewing-hero-sky">
      <HeaderOne />
      <ViewingHeroTrust />
    </div>
    <ViewingForm />
    <FancyBanner />
    <FooterFour openLinksInNewTab />
  </div>
);

export default ViewingPage;
