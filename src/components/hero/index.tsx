import React from "react";
import Image from "next/image";
import ListingHeader from "@/assets/img/bg/listing-header.webp";
import RatingStars from "@/assets/images/icon/stars.svg";

interface HeroSectionProps {
    openModal?: () => void;
    openReminderModal?: () => void;
}

export default function HeroSection({ openModal, openReminderModal }: HeroSectionProps)
{
    return (
        <>
            <section className="hero-con">
                <div className="hero-box">
                    <div className="hero-thumbnail">
                        <Image src={ListingHeader} alt="listing header image" className="object-fit-cover w-100 h-100" />
                    </div>
                    <div className="hero-content">
                        <div className="container">
                            <div className="d-flex flex-column gap-3">
                                <div className="hero-header">
                                    <div className="hero-header__rating-box d-flex flex-column gap-2 mb-3">
                                        <Image src={RatingStars} alt="ratings" />
                                        <p>
                                            Trusted by <span> 385+ Students </span>
                                        </p>
                                    </div>
                                    <h2 className="hero-header__title">
                                        Moving Out or Looking for a New Roommate?
                                    </h2>
                                </div>

                                <p>
                                    List your room and get <span> €200 </span> when it's taken.
                                </p>
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
                                </ul>

                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-lg btn-warning"
                                        onClick={openModal}
                                    >
                                        List My Room
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-lg btn-outline-light" 
                                        onClick={openReminderModal}
                                    >
                                        Remind me later
                                    </button>
                                </div>
                                <p className="hero-msg-text">
                                    Listing is Free
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}