import Image from "next/image";
import MallIcon from "@/assets/images/icon/mall.svg";
import StudioIcon from "@/assets/images/icon/studio.svg";
import HouseIcon from "@/assets/images/icon/house.svg";
import StudentHouseIcon from "@/assets/images/icon/student-house.svg";
import SearchableCitySelect from "@/components/ui/SearchableCitySelect";
import {DUTCH_CITIES} from "@/utils/countries";
import React from "react";
import Form from "react-bootstrap/Form";

export default function SecondStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__second-step">
            <div className="list-room-modal__second-step__body d-flex flex-column">
                <h2>
                    Tell us the basics. You can change these later
                </h2>
                <div className="house-room-box row m-0 gx-0">
                    <div className="form-group checkbox-card-type col p-0">
                        <input type="radio" class="btn-check" name="apartment" id="apartment" autocomplete="off" />
                        <label class="btn d-flex flex-column h-100" for="apartment">
                            <Image src={MallIcon} alt="property icon" />
                            <span>
                                Room in a shared apartment
                            </span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col p-0">
                        <input type="radio" class="btn-check" name="apartment" id="studio-house" autocomplete="off" />
                        <label class="btn d-flex flex-column h-100" for="studio-house">
                            <Image src={StudioIcon} alt="property icon" />
                            <span>
                                Studio
                            </span>
                        </label>
                    </div>
                </div>
                <div className="house-room-box row m-0 gx-0">
                    <div className="form-group checkbox-card-type col p-0">
                        <input type="radio" class="btn-check" name="apartment" id="single-house" autocomplete="off" />
                        <label class="btn d-flex flex-column h-100" for="single-house">
                            <Image src={HouseIcon} alt="property icon" />
                            <span>
                                Entire place
                            </span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col p-0">
                        <input type="radio" class="btn-check" name="apartment" id="student-house" autocomplete="off" />
                        <label class="btn d-flex flex-column h-100" for="student-house">
                            <Image src={StudentHouseIcon} alt="property icon" />
                            <span>
                                Student house
                            </span>
                        </label>
                    </div>
                </div>


                <div className="form-group">
                    <SearchableCitySelect
                        cities={DUTCH_CITIES}
                        placeholder="City"
                    />
                </div>

                <div className="form-group">
                    <Form.Control
                        type="text"
                        placeholder="Address"
                    />
                    <p className="fs-14 text-center w-100 d-block mt-2">
                        <span>🔒 Exact address is never public </span>
                    </p>
                </div>

                <div className="d-flex justify-content-between flex-row align-items-center">
                    <p>
                        Registration is possible?
                        <span className="d-block">
                            tooltip: we’ll still list it
                        </span>
                    </p>
                    <div>
                        <div className="form-group form-radio-group d-flex flex-row align-items-center">
                            <Form.Check
                                type="radio"
                                name="registration-possible"
                                id="yes"
                            />
                            <label htmlFor="yes">Yes</label>
                        </div>
                        <div className="form-group form-radio-group d-flex flex-row align-items-center">
                            <Form.Check
                                type="radio"
                                name="registration-possible"
                                id="no"
                            />
                            <label htmlFor="no">No</label>
                        </div>
                        <div className="form-group form-radio-group d-flex flex-row align-items-center">
                            <Form.Check
                                type="radio"
                                name="registration-possible"
                                id="not-sure"
                            />
                            <label htmlFor="not-sure">Not sure</label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}