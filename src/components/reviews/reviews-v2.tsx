import ReviewUserThree from "@/assets/images/media/review-user-three.png";
import ReviewCardV2 from "@/components/card/review-card-v2";
import Carousel from 'react-multi-carousel';

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
            thumbnail_image: ReviewUserThree,
            name: 'Dagruel Manulo',
            date: '23 June 2025',
            location: 'Sydney, Australia',
            subject: 'Amazing Experience!',
            message: "Lorem ipsum dolor sit amet, <br /> consectetur adipiscing Proin pharetra <br /> ultrices magna ac Pellentesque <br /> pellentesque dui vitae diam suscipit.",
            rate: 5,
            review_from: 'google',
        },
        {
            thumbnail_image: ReviewUserThree,
            name: 'Dagruel Manulo',
            date: '23 June 2025',
            location: 'Sydney, Australia',
            subject: 'Amazing Experience!',
            message: "Lorem ipsum dolor sit amet, <br /> consectetur adipiscing Proin pharetra <br /> ultrices magna ac Pellentesque <br /> pellentesque dui vitae diam suscipit.",
            rate: 5,
            review_from: 'google',
        }
    ];

    return (
        <section className="review-sec-v2">
            <div className="container">
                <h2 className="section__title">
                    What People Say About Us
                </h2>

                <Carousel responsive={responsive}
                          ssr={true}
                          keyBoardControl={true}
                          removeArrowOnDeviceType={["tablet", "mobile"]}
                          itemClass="">
                    {reviews && reviews.map((room, roomIndex) =>
                        <ReviewCardV2 key={roomIndex} item={room} />
                    )}
                </Carousel>

            </div>
        </section>
    )
}