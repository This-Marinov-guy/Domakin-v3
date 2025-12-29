import Image from "next/image";
import PlusIcon from "@/assets/images/icon/plus.svg";
import GalleryOne from "@/assets/images/media/gallery-one.png";
import GalleryTwo from "@/assets/images/media/gallery-two.png";
import GalleryThree from "@/assets/images/media/gallery-three.png";
import GalleryFour from "@/assets/images/media/gallery-four.png";
import React from "react";
import Link from "next/link";
import Form from "react-bootstrap/Form";

export default function FifthStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__second-step">
            <div className="list-room-modal__second-step__body d-flex flex-column">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <div>
                        <h2 className="fs-16">
                            Good job! How does it look
                        </h2>
                        <p className="fs-14">
                            Drag to reorder
                        </p>
                    </div>
                    <div>
                        <Link href="#">
                            <Image src={PlusIcon} alt="property icon" />
                        </Link>
                    </div>
                </div>
                <div className="gallery-box row row-cols-2 g-3">
                    <div className="gallery-item col">
                        <div className="ratio ratio-1x1">
                        <Image src={GalleryOne} alt="Gallery image" className="object-fit-contain w-100 h-100" />
                        </div>
                    </div>
                    <div className="gallery-item col">
                        <div className="ratio ratio-1x1">
                        <Image src={GalleryTwo} alt="Gallery image" className="object-fit-contain w-100 h-100" />
                        </div>
                    </div>
                    <div className="gallery-item col">
                        <div className="ratio ratio-1x1">
                        <Image src={GalleryThree} alt="Gallery image" className="object-fit-contain w-100 h-100" />
                        </div>
                    </div>
                    <div className="gallery-item col">
                        <div className="ratio ratio-1x1">
                        <Image src={GalleryFour} alt="Gallery image" className="object-fit-contain w-100 h-100" />
                        </div>
                    </div>

                    <div className="gallery-item col">
                        <div className="ratio ratio-1x1">
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
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}