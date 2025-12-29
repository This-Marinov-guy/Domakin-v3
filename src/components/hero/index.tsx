import ListingHeader from "@/assets/img/bg/listing-header.webp";
import RatingStars from "@/assets/images/icon/stars.svg";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection()
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
                                    List your room and get <span> €200 </span> when it’s taken.
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
                                    <Link href="#" className="btn btn-lg btn-warning" data-bs-toggle="modal" data-bs-target="#list-room-modal">
                                        List My Room
                                    </Link>
                                    <button className="btn btn-lg btn-outline-light" data-bs-toggle="modal" data-bs-target="#reminder-modal">
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