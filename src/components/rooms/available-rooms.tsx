import RoomCard from "@/components/card/room-card";
import RoomOne from "@/assets/images/hotel/room-one.png";
import RoomTwo from "@/assets/images/hotel/room-two.png";
import Carousel from 'react-multi-carousel';

export default function AvailableRooms() {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
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
    const rooms = [
        {
            thumbnail_image: RoomOne,
            title: 'Available Room',
            price: '€940/',
            plan_type: 'month',
            location: 'Topaasstraat, Groningen',
            details: [
                'Indefinite Contract',
                'Registration Possible',
                'Utilities Included',
            ],
            url: '/'
        },
        {
            thumbnail_image: RoomTwo,
            title: 'Available Room',
            price: '€940/',
            plan_type: 'month',
            location: 'Topaasstraat, Groningen',
            details: [
                'Indefinite Contract',
                'Registration Possible',
                'Utilities Included',
            ],
            url: '/'
        }
    ];

    return (
        <section className="rooms-sec">
            <div className="container">
                <h2 className="section__title">
                    Available Rooms
                </h2>

                <Carousel responsive={responsive}
                          ssr={true}
                          keyBoardControl={true}
                          removeArrowOnDeviceType={["tablet", "mobile"]}
                          itemClass="carousel-item-width">
                    {rooms && rooms.map((room, roomIndex) =>
                        <RoomCard key={roomIndex} item={room} />
                    )}
                </Carousel>

            </div>
        </section>
    )
}