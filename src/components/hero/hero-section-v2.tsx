import React from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import RatingStars from "@/assets/images/icon/stars.svg";
import ListIcon from "@/assets/images/icon/list.svg";

interface HeroSectionV2Props {
    openModal?: () => void;
}

export default function HeroSectionV2({ openModal }: HeroSectionV2Props) {
    const { t } = useTranslation("translations");
    return (
        <>
            <section className="hero-con-v2">
                <div className="hero-box-v2">

                    <div className="hero-header-v2">
                        <div className="container" style={{ paddingTop: '80px' }}>
                            <div className="hero-header__rating-box-v2">
                                <Image src={RatingStars} alt="ratings" />
                                <p>
                                    {t("hero_lending.trusted_by")} <span> 500+ </span> {t("hero_lending.trusted_by_suffix")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-content-v2">
                        <div className="container">

                            <div className="d-flex flex-column">

                                <h2 className="hero-header__title-v2">
                                    <Trans
                                        i18nKey="translations:hero_lending.get_commission_title"
                                        components={{ span: <span />, br: <br /> }}
                                    />
                                </h2>
                                
                                {/* <p className="hero-v2-msg-text">
                                    Listing is Free
                                </p>

                                <button 
                                    type="button" 
                                    className="btn btn-lg btn-warning" 
                                    onClick={openModal}
                                >
                                    <Image src={ListIcon} alt="List room icon" /> List My Room
                                </button> */}

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}