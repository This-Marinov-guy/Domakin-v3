import React from "react";
import StepsBar from "@/components/steps/stepsBar";
import Form from "react-bootstrap/Form";

export default function SixthStep({steps, currentStep}: {steps: string[], currentStep: number}) {
    return (
        <div className="list-room-modal__first-step">
            <div className="list-room-modal__first-step__body d-flex flex-column">
                <StepsBar
                    steps={steps}
                    currentStep={currentStep}
                />
                <h2>
                    The basics
                </h2>

                <div>
                    <div className="form-group form-radio-group d-flex flex-row align-items-center">
                        <Form.Check
                            type="checkbox"
                            name="flexible-dates"
                            id="flexible-dates"
                        />
                        <label htmlFor="flexible-dates">
                            Flexible dates
                        </label>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="d-flex justify-content-between align-items-center flex-row eleven-gap">
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="flexible-dates"
                                id="monthly-rent"
                                placeholder="Monthly Rent"
                            />
                        </div>
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="flexible-dates"
                                id="deposit"
                                placeholder="Deposit"
                            />
                        </div>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="d-flex gap-3 flex-row align-items-start">
                        <p>
                            <span className="d-block">
                                Bills included?
                            </span>
                        </p>
                        <div>
                            <div className="form-group form-radio-group d-flex flex-row align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="bill-include"
                                    id="yes"
                                />
                                <label htmlFor="yes">Yes</label>
                            </div>
                            <div className="form-group form-radio-group d-flex flex-row align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="bill-include"
                                    id="no"
                                />
                                <label htmlFor="no">No</label>
                            </div>
                            <div className="form-group form-radio-group d-flex flex-row align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="bill-include"
                                    id="not-sure"
                                />
                                <label htmlFor="not-sure">Bills estimate (€)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="house-room-box row m-0 gx-0 gap-3">
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="apartment" id="furnished" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="furnished">
                                <span>
                                    Furnished
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="apartment" id="semi" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="semi">
                                <span>
                                    semi
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="apartment" id="unfurnished" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="unfurnished">
                                <span>
                                    unfurnished
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="d-flex justify-content-between align-items-center flex-row eleven-gap">
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="flexible-dates"
                                id="size"
                                placeholder="Size (m²)"
                                className="text-center"
                            />
                        </div>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="d-flex justify-content-between align-items-center flex-row eleven-gap">
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="roommate-count"
                                id="roommate-count"
                                placeholder="Roommate-count"
                                className="text-center"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label>
                        Roommates gender
                    </label>
                    <hr className="dropdown-divider" />
                    <div className="house-room-box row m-0 gx-0 gap-3 mt-2">
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="gender" id="male" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="male">
                                <span>
                                    Male
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="gender" id="female" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="female">
                                <span>
                                    Female
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" className="btn-check" name="gender" id="mixed" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" htmlFor="mixed">
                                <span>
                                    Mixed
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label>
                        You prefer
                    </label>
                    <hr className="dropdown-divider" />
                    <div className="house-room-box row mt-2">
                        <div className="form-group checkbox-card-type col-3">
                            <input type="radio" className="btn-check" name="prefer" id="prefer-male" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="prefer-male">
                                <span>
                                    Male
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="radio" className="btn-check" name="prefer" id="prefer-female" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="prefer-female">
                                <span>
                                    Female
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="radio" className="btn-check" name="prefer" id="no-preference" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="no-preference">
                                <span>
                                    No preference
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label>
                        Shared areas
                    </label>
                    <hr className="dropdown-divider" />
                    <div className="house-room-box row gx-2 mt-2">
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" className="btn-check" name="prefer" id="kitchen" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="kitchen">
                                <span>
                                    kitchen
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" className="btn-check" name="prefer" id="living" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="living">
                                <span>
                                    living
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" className="btn-check" name="prefer" id="bathroom" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="bathroom">
                                <span>
                                    bathroom
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" className="btn-check" name="prefer" id="toilet" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="toilet">
                                <span>
                                    toilet
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label>
                        House rules
                    </label>
                    <hr className="dropdown-divider" />
                    <div className="house-room-box row gx-2 gy-2 mt-2">
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="no-smoking" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="no-smoking">
                                <span>
                                    No smoking
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="no-pets" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="no-pets">
                                <span>
                                    No pets
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="quiet-hours" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="quiet-hours">
                                <span>
                                    Quiet hours
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="parties-ok" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="parties-ok">
                                <span>
                                    Parties ok
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="cleaning-schedule" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="cleaning-schedule">
                                <span>
                                    Cleaning schedule
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" className="btn-check" name="house-rules[]" id="kitchen-rule" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="kitchen-rule">
                                <span>
                                    Kitchen
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <hr className="dropdown-divider" />

                <div>
                    <div className="d-flex justify-content-between align-items-center flex-row eleven-gap">
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="bathroom-no"
                                id="bathroom-no"
                                placeholder="Bathrooms #"
                            />
                        </div>
                        <div className="form-group w-100 d-flex flex-row align-items-center">
                            <Form.Control
                                type="text"
                                name="toilet-no"
                                id="toilet-no"
                                placeholder="Toilet #"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label>
                        Amenities
                    </label>
                    <hr className="dropdown-divider" />
                    <div className="house-room-box row gx-2 gy-2 mt-2 mb-50">
                        <div className="form-group checkbox-card-type col-5">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="washing-machine" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="washing-machine">
                                <span>
                                    Washing machine
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="dryer" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" htmlFor="dryer">
                                <span>
                                    Dryer
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="dishwasher" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="dishwasher">
                                <span>
                                    Dishwasher
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="balcony" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="balcony">
                                <span>
                                    Balcony
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="bike-storage" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="bike-storage">
                                <span>
                                    Bike storage
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="Oven" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="Oven">
                                <span>
                                    Oven
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="microwave" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="microwave">
                                <span>
                                    Microwave
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="parking-space" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="parking-space">
                                <span>
                                    Parking space
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-5">
                            <input type="checkbox" className="btn-check" name="amenities[]" id="study-area" autoComplete="off" />
                            <label className="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" htmlFor="study-area">
                                <span>
                                    Study Area
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}