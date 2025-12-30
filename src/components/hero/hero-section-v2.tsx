import React from "react";
import Image from "next/image";
import RatingStars from "@/assets/images/icon/stars.svg";
import ListIcon from "@/assets/images/icon/list.svg";

interface HeroSectionV2Props {
    openModal?: () => void;
}

export default function HeroSectionV2({ openModal }: HeroSectionV2Props)
{
    return (
        <>
            <section className="hero-con-v2">
                <div className="hero-box-v2">

                    <div className="hero-header-v2">
                        <div className="container">
                            <div className="hero-header__rating-box-v2">
                                <Image src={RatingStars} alt="ratings" />
                                <p>
                                    Trusted by <span> 385+ </span> Students
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-content-v2">
                        <div className="container">

                            <div className="d-flex flex-column">

                                <h2 className="hero-header__title-v2">
                                    Get <span> €200 </span> when you list <br /> your room
                                </h2>
                                <h3 className="hero-header__sub-title-v2">
                                    Moving out or looking for a <br /> new roommate?
                                </h3>

                                <ul className="">
                                    <li>
                                        Fill the room fast
                                    </li>
                                    <li>
                                        Minimal Hassle
                                    </li>
                                    <li>
                                        Avoid Double Rent
                                    </li>
                                    <li>
                                        Receive <span> €200 </span>
                                    </li>
                                </ul>

                                <p className="hero-v2-msg-text">
                                    Listing is Free
                                </p>

                                <button 
                                    type="button" 
                                    className="btn btn-lg btn-warning" 
                                    onClick={openModal}
                                >
                                    <Image src={ListIcon} alt="List room icon" /> List My Room
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}