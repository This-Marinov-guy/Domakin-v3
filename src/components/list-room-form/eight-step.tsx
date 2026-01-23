import React from "react";
import StepsBar from "@/components/steps/stepsBar";
import Form from "react-bootstrap/Form";
import RoomOne from "@/assets/images/hotel/room.png";
import RoomCardV3 from "@/components/card/room-card-v3";

export default function EightStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    const rooms = [
        {
            thumbnail_image: RoomOne,
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
        }
    ];

    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <StepsBar
                    steps={steps}
                    currentStep={currentStep}
                />
                <h2>
                    Review & Publish
                </h2>

                {rooms && rooms.map((room, roomIndex) =>
                    <RoomCardV3 key={roomIndex} item={room} />
                )}

            </div>
        </div>
    )
}