
import MapMarker from "@/assets/images/map/map-marker.svg";
import ArrowLeftWhite from "@/assets/images/icon/arrow-left-2.svg";
import Link from "next/link";
import Image from "next/image";
import Carousel from 'react-multi-carousel';

export default function RoomCardV2({item}) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
            partialVisibilityGutter: 30
        }
    };

    return (
        <div className="card custom-card room-card-v2">
            <span className={`custom-card__status ${item.status && item.status === "available" ? "available" : ""}`}>
                {item.status && item.status === "available" ? "Available" : "Booked"}
            </span>
            <Carousel responsive={responsive}
                      ssr={true}
                      showDots={true}
                      keyBoardControl={true}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      itemClass="">
                {item.thumbnail_images && item.thumbnail_images.map((image, imageIndex) =>
                    <div className="card-img custom-card__thumbnail room-card-v2__thumbnail">
                        <Image src={image} alt="Room Image" className="object-fit-cover w-100 h-100" />
                    </div>
                )}
            </Carousel>
            <div className="card-content custom-card__content room-card-v2__content">
                <div className="card-header custom-card__header room-card-v2__header">
                    <p className="card-subtitle custom-card__header__sub-title room-card-v2__header__sub-title">
                        <Image src={MapMarker} alt="map marker" className="d-inline" /> {item.location && item.location}
                    </p>
                </div>
                <h3 className="card-title custom-card__header__title room-card-v2__header__title">
                    {item.title}
                </h3>
                <p dangerouslySetInnerHTML={{ __html: item && item.text }}></p>
            </div>
            <div className="card-footer d-flex flex-row justify-content-between align-items-center custom-card__footer room-card-v2__footer">
                <h4 className="custom-card__header__price room-card-v2__header__price">
                    <span>{item.price && item.price}</span>{item.plan_type && item.plan_type}
                </h4>
                <Link href={item.url} className="btn btn-lg btn-warning custom-card__footer__btn room-card-v2__footer__btn">
                    <Image src={ArrowLeftWhite} alt="arrow icon" />
                </Link>
            </div>
        </div>
    )
}