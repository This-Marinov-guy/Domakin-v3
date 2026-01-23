import React from "react";
import Form from "react-bootstrap/Form";
import PlusIcon from "@/assets/images/icon/plus.svg";
import CameraIcon from "@/assets/images/icon/camera.svg";
import Image from "next/image";

export default function FourStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__second-step">
            <div className="list-room-modal__second-step__body d-flex flex-column gap-4">

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-0">
                        <h2>
                            Bedroom (0/2-3)
                        </h2>
                        <p>
                            Shoot from doorway, lights on, include window.
                        </p>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Add photos"
                            id="bedroom-photos"
                        />
                        <label htmlFor="bedroom-photos" className="d-flex flex-column w-100">
                        <span>
                            <Image src={PlusIcon} alt="plus icon" />
                        </span>
                            Add Photos
                        </label>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Take new photos"
                            id="bedroom-photos-take"
                        />
                        <label htmlFor="bedroom-photos-take" className="d-flex flex-column w-100">
                        <span>
                            <Image src={CameraIcon} alt="plus icon" />
                        </span>
                            Take new photos
                        </label>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-0">
                        <h2>
                            Kitchen (0/1-2)
                        </h2>
                        <p>
                            Wide shot of appliances + counter.
                        </p>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Add photos"
                            id="kitchen-photos"
                        />
                        <label htmlFor="kitchen-photos" className="d-flex flex-column w-100">
                        <span>
                            <Image src={PlusIcon} alt="plus icon" />
                        </span>
                            Add Photos
                        </label>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Take new photos"
                            id="kitchen-photos-take"
                        />
                        <label htmlFor="kitchen-photos-take" className="d-flex flex-column w-100">
                        <span>
                            <Image src={CameraIcon} alt="plus icon" />
                        </span>
                            Take new photos
                        </label>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column gap-0">
                        <h2>
                            Bathroom (0/1)
                        </h2>
                        <p>
                            Sink + shower + floor; seat down.
                        </p>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Add photos"
                            id="bathroom-photos"
                        />
                        <label htmlFor="bathroom-photos" className="d-flex flex-column w-100">
                        <span>
                            <Image src={PlusIcon} alt="plus icon" />
                        </span>
                            Add Photos
                        </label>
                    </div>

                    <div className="form-group form-group-file">
                        <Form.Control
                            type="file"
                            placeholder="Take new photos"
                            id="bathroom-photos-take"
                        />
                        <label htmlFor="bathroom-photos-take" className="d-flex flex-column w-100">
                        <span>
                            <Image src={CameraIcon} alt="plus icon" />
                        </span>
                            Take new photos
                        </label>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row gap-0 justify-content-between align-items-center">
                        <h2>
                            Toilet (0/ 1)
                        </h2>
                        <div className="form-group form-radio-group d-flex flex-row align-items-center w-50">
                            <Form.Check
                                type="checkbox"
                                name="registration-possible"
                                id="bathroom-toilet-same"
                            />
                            <label htmlFor="bathroom-toilet-same">
                                Toilet and bathroom
                                are combined
                            </label>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}