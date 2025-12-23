import ReviewUserOne from "@/assets/images/media/review-user-one.png";
import ReviewUserTwo from "@/assets/images/media/review-user-two.png";
import ReviewCard from "@/components/card/review-card";
import Carousel from 'react-multi-carousel';
import Link from "next/link";

export default function ReviewsSection() {

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
    const reviews = [
        {
            thumbnail_image: ReviewUserOne,
            name: 'Manuela Chividzhiyan',
            date: '23 June 2025',
            message: 'The team is very nice. I had a great experience working with Domakin, as they addresses all my questions and concerns throughout the process of finding tenants for my apartment. I strongly recommend their service.',
            rate: 5,
        },
        {
            thumbnail_image: ReviewUserTwo,
            name: 'Manuela Chividzhiyan',
            date: '23 June 2025',
            message: 'The team is very nice. I had a great experience working with Domakin, as they addresses all my questions and concerns throughout the process of finding tenants for my apartment. I strongly recommend their service.',
            rate: 5,
        }
    ];

    return (
        <section>
            <div className="container">
                <h2 className="section__title">
                    What People Say About Us
                </h2>

                <Carousel responsive={responsive}
                          ssr={true}
                          keyBoardControl={true}
                          removeArrowOnDeviceType={["tablet", "mobile"]}
                          itemClass="carousel-item-width">
                    {reviews && reviews.map((room, roomIndex) =>
                        <ReviewCard key={roomIndex} item={room} />
                    )}
                </Carousel>

                <Link href="#" className="custom-card__footer__btn btn btn-lg btn-warning w-100 mb-2">
                    List My Room
                </Link>

                <p className="mt-1 mb-3 text-center opacity-50">
                    List your room in 2-3 minutes
                </p>

            </div>
        </section>
    )
}