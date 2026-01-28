import Image from "next/image";
import MallIcon from "@/assets/images/icon/mall.svg";
import StudioIcon from "@/assets/images/icon/studio.svg";
import HouseIcon from "@/assets/images/icon/house.svg";
import StudentHouseIcon from "@/assets/images/icon/student-house.svg";
import SearchableCitySelect from "@/components/ui/SearchableCitySelect";
import { DUTCH_CITIES } from "@/utils/countries";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default function SecondStep({ steps, currentStep }: { steps: string[], currentStep: number }) {
    const [city, setCity] = useState("");
    return (
        <div className="list-room-modal__second-step">
            <div className="list-room-modal__second-step__body d-flex flex-column">

                <div className="house-room-box row gx-0">
                    <div className="form-group checkbox-card-type col m-2">
                        <input type="radio" className="btn-check" name="apartment" id="apartment" autoComplete="off" />
                        <label className="btn d-flex flex-column h-100" htmlFor="apartment">
                            <Image src={MallIcon} alt="property icon" />
                            <span>
                                Room in a shared apartment
                            </span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col m-2">
                        <input type="radio" className="btn-check" name="apartment" id="studio-house" autoComplete="off" />
                        <label className="btn d-flex flex-column h-100" htmlFor="studio-house">
                            <Image src={StudioIcon} alt="property icon" />
                            <span>
                                Studio
                            </span>
                        </label>
                    </div>
                </div>
                <div className="house-room-box row gx-0">
                    <div className="form-group checkbox-card-type col m-2">
                        <input type="radio" className="btn-check" name="apartment" id="single-house" autoComplete="off" />
                        <label className="btn d-flex flex-column h-100" htmlFor="single-house">
                            <Image src={HouseIcon} alt="property icon" />
                            <span>
                                Entire place
                            </span>
                        </label>
                    </div>
                    <div className="form-group checkbox-card-type col m-2">
                        <input type="radio" className="btn-check" name="apartment" id="student-house" autoComplete="off" />
                        <label className="btn d-flex flex-column h-100" htmlFor="student-house">
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
                        value={city}
                        onChange={setCity}
                    />
                </div>

                <div className="input-group-meta form-group">
                    <label htmlFor="">Address</label>
                    <Form.Control
                        type="text"
                    />
                    <p className="fs-14 text-center w-100 d-block mt-2">
                        <span>🔒 Exact address is never public </span>
                    </p>
                </div>

                <div className="bg-pink-three p-3 d-flex justify-content-center flex-row align-items-center">
                    <div className="switch-item d-flex items-center justify-center gap-4">
                        <label htmlFor="registration-switch" className="switch-label">
                           Is Registration Possible
                        </label>
                        <div className="d-flex gap-3 align-items-center switch-control">
                            <Form.Check
                                type="switch"
                                id="registration-switch"
                                // checked={propertyData.registration === true || propertyData.registration === "yes"}
                                // onChange={(e) => {
                                //     updateListingData(
                                //         "propertyData",
                                //         "registration",
                                //         e.target.checked
                                //     );
                                // }}
                                // isInvalid={errorFields.includes("propertyData.registration")}
                                className="custom-switch"
                            />
                            {/* <span className="switch-status">
                                {propertyData.registration === true || propertyData.registration === "yes"
                                    ? t("common.yes")
                                    : t("common.no")}
                            </span> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}