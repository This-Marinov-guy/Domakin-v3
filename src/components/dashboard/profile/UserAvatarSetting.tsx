import PrefixPhoneInput from "@/components/ui/inputs/phone/PrefixPhoneInput";
import { useStore } from "@/stores/storeContext";
import Form from "react-bootstrap/Form";
import OpenEye from "@/assets/images/icon/icon_68.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

const UserAvatarSetting = () => {
  const { userStore } = useStore();
  const {
    user,
    editUser,
    editUserErrors,
    updateUserDetails,
    loadUserEditDetails,
  } = userStore;

  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  useEffect(() => {
    loadUserEditDetails();
  }, [user]);

  return (
    <div className="row">
      <div className="col-sm-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">First Name*</label>
          <Form.Control
            value={editUser.firstName}
            onChange={(e) => {
              updateUserDetails("firstName", e.target.value);
            }}
            type="text"
            isInvalid={editUserErrors.includes("firstName")}
          />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Last Name*</label>
          <Form.Control
            value={editUser.lastName}
            onChange={(e) => {
              updateUserDetails("lastName", e.target.value);
            }}
            type="text"
            isInvalid={editUserErrors.includes("lastName")}
          />
        </div>
      </div>
      <div className="col-sm-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Email*</label>
          <Form.Control
            value={editUser.email}
            onChange={(e) => {
              updateUserDetails("email", e.target.value);
            }}
            type="email"
            isInvalid={editUserErrors.includes("email")}
          />
        </div>
      </div>
      {/* <div className="col-sm-6">
            <div className="dash-input-wrapper mb-30">
               <label htmlFor="">Position*</label>
               <NiceSelect className="nice-select"
                  options={[
                     { value: "1", text: "Agent" },
                     { value: "2", text: "Agency" },
                  ]}
                  defaultCurrent={0}
                  onChange={selectHandler}
                  name=""
                  placeholder="" />
            </div>
         </div> */}
      <div className="col-sm-6">
        <div className="position-relative dash-input-wrapper mb-30">
          <label htmlFor="">Phone Number*</label>
          <PrefixPhoneInput
            value={editUser.phone}
            onChange={(value: string) => {
              updateUserDetails("phone", value);
            }}
            isInvalid={editUserErrors.includes("phone")}
          />{" "}
        </div>
      </div>

      <hr />
      <h6 className="mb-30">Change your password</h6>

      <div className="col-sm-6 dash-input-wrapper position-relative mb-20">
        <label htmlFor="">Password*</label>
        <Form.Control
          type={isPasswordVisible ? "text" : "password"}
          name="password"
          value={editUser.password}
          onChange={(e) => {
            updateUserDetails("password", e.target.value);
          }}
          isInvalid={editUserErrors.includes("password")}
        />
        <span className="placeholder_icon">
          <span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}>
            <Image onClick={togglePasswordVisibility} src={OpenEye} alt="" />
          </span>
        </span>
      </div>

      <div className="col-sm-6 dash-input-wrapper position-relative mb-20">
        <label htmlFor="">Confirm Password*</label>
        <Form.Control
          type={isPasswordVisible ? "text" : "password"}
          name="password_confirmation"
          value={editUser.password_confirmation}
          onChange={(e) => {
            updateUserDetails("password_confirmation", e.target.value);
          }}
          isInvalid={editUserErrors.includes("password_confirmation")}
        />
        <span className="placeholder_icon">
          <span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}>
            <Image onClick={togglePasswordVisibility} src={OpenEye} alt="" />
          </span>
        </span>
      </div>

      {/* <div className="col-12">
            <div className="dash-input-wrapper">
               <label htmlFor="">About*</label>
               <textarea className="size-lg"
                  placeholder="I am working for the last 4 years as a web designer, graphics designer and well as UI/UX designer............."></textarea>
               <div className="alert-text">Brief description for your profile. URLs are hyperlinked.</div>
            </div>
         </div> */}
    </div>
  );
};

export default observer(UserAvatarSetting);
