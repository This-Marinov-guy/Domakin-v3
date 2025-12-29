import RoomCardV2 from "@/components/card/room-card-v2";
import RoomOne from "@/assets/images/hotel/room.png";
import Carousel from 'react-multi-carousel';

export default function AvailableRooms() {
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
            items: 1
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
            thumbnail_images: [
                RoomOne,
                RoomOne,
                RoomOne,
                RoomOne
            ],
            title: 'Available Room',
            text: 'Indefinite contract, registration possible',
            status: 'available',
            price: '$2199',
            plan_type: '/per month',
            location: 'Topaasstraat, Groningen',
            details: [
                'Indefinite Contract',
                'Registration Possible',
                'Utilities Included',
            ],
            url: '/'
        },
        {
            thumbnail_images: [
                RoomOne,
                RoomOne,
                RoomOne,
                RoomOne
            ],
            title: 'Available Room',
            text: 'Indefinite contract, registration possible',
            status: 'available',
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
        <section className="rooms-sec-v2">
            <div className="container">

                <Carousel responsive={responsive}
                          ssr={true}
                          keyBoardControl={true}
                          removeArrowOnDeviceType={["tablet", "mobile"]}
                          itemClass="">
                    {rooms && rooms.map((room, roomIndex) =>
                        <RoomCardV2 key={roomIndex} item={room} />
                    )}
                </Carousel>

            </div>
        </section>
    )
}