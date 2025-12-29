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

                <hr class="dropdown-divider" />

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

                <hr class="dropdown-divider" />

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

                <hr class="dropdown-divider" />

                <div>
                    <div className="house-room-box row m-0 gx-0 gap-3">
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="apartment" id="furnished" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="furnished">
                                <span>
                                    Furnished
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="apartment" id="semi" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="semi">
                                <span>
                                    semi
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="apartment" id="unfurnished" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="unfurnished">
                                <span>
                                    unfurnished
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <hr class="dropdown-divider" />

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

                <hr class="dropdown-divider" />

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
                    <hr class="dropdown-divider" />
                    <div className="house-room-box row m-0 gx-0 gap-3 mt-2">
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="gender" id="male" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="male">
                                <span>
                                    Male
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="gender" id="female" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="female">
                                <span>
                                    Female
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col p-0">
                            <input type="radio" class="btn-check" name="gender" id="mixed" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-3 text-center rounded-4" for="mixed">
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
                    <hr class="dropdown-divider" />
                    <div className="house-room-box row mt-2">
                        <div className="form-group checkbox-card-type col-3">
                            <input type="radio" class="btn-check" name="prefer" id="prefer-male" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="prefer-male">
                                <span>
                                    Male
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="radio" class="btn-check" name="prefer" id="prefer-female" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="prefer-female">
                                <span>
                                    Female
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="radio" class="btn-check" name="prefer" id="no-preference" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="no-preference">
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
                    <hr class="dropdown-divider" />
                    <div className="house-room-box row gx-2 mt-2">
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" class="btn-check" name="prefer" id="kitchen" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="kitchen">
                                <span>
                                    kitchen
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" class="btn-check" name="prefer" id="living" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="living">
                                <span>
                                    living
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" class="btn-check" name="prefer" id="bathroom" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="bathroom">
                                <span>
                                    bathroom
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col">
                            <input type="radio" class="btn-check" name="prefer" id="toilet" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="toilet">
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
                    <hr class="dropdown-divider" />
                    <div className="house-room-box row gx-2 gy-2 mt-2">
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="no-smoking" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="no-smoking">
                                <span>
                                    No smoking
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="no-pets" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="no-pets">
                                <span>
                                    No pets
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="quiet-hours" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="quiet-hours">
                                <span>
                                    Quiet hours
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="parties-ok" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="parties-ok">
                                <span>
                                    Parties ok
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="cleaning-schedule" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="cleaning-schedule">
                                <span>
                                    Cleaning schedule
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" class="btn-check" name="house-rules[]" id="kitchen-rule" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="kitchen-rule">
                                <span>
                                    Kitchen
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <hr class="dropdown-divider" />

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
                    <hr class="dropdown-divider" />
                    <div className="house-room-box row gx-2 gy-2 mt-2 mb-50">
                        <div className="form-group checkbox-card-type col-5">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="washing-machine" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="washing-machine">
                                <span>
                                    Washing machine
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="dryer" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-1 text-center rounded-4 fs-12" for="dryer">
                                <span>
                                    Dryer
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="dishwasher" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="dishwasher">
                                <span>
                                    Dishwasher
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="balcony" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="balcony">
                                <span>
                                    Balcony
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-6">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="bike-storage" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="bike-storage">
                                <span>
                                    Bike storage
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="Oven" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="Oven">
                                <span>
                                    Oven
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-3">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="microwave" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="microwave">
                                <span>
                                    Microwave
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-4">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="parking-space" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="parking-space">
                                <span>
                                    Parking space
                                </span>
                            </label>
                        </div>
                        <div className="form-group checkbox-card-type col-5">
                            <input type="checkbox" class="btn-check" name="amenities[]" id="study-area" autocomplete="off" />
                            <label class="btn d-flex flex-column h-100 py-2 px-2 text-center rounded-4 fs-12" for="study-area">
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