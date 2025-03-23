import UserAvatarSetting from "@/components/dashboard/profile/UserAvatarSetting";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import avatar_1 from "@/assets/images/dashboard/avatar_02.jpg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import Spinner from "react-bootstrap/esm/Spinner";

const ProfileEditForm = () => {
  const { userStore } = useStore();
  const { user, updateUserDetails, updateProfile, editUserLoading } = userStore;

  const [imagePreview, setImagePreview] = useState<StaticImageData | string>(
    avatar_1
  );

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      updateUserDetails("profileImage", file);
    }
  };

  return (
    <>
      <h2 className="main-title d-block d-lg-none">Profile</h2>
      <div className="bg-white card-box border-20">
        <div className="user-avatar-setting d-flex align-items-center mb-30">
          <Image
            src={imagePreview}
            alt="User Avatar"
            className="lazy-img user-img"
            width={100}
            height={100}
          />
          <div className="upload-btn position-relative tran3s ms-4 me-3">
            Upload new photo
            <input
              type="file"
              id="uploadImg"
              name="uploadImg"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            disabled={editUserLoading}
            onClick={updateProfile}
            className="dash-btn-two tran3s me-3"
          >
            {editUserLoading ? <Spinner /> : "Save"}
          </button>
        </div>
        <UserAvatarSetting />
      </div>

      {/* <div className="button-group d-inline-flex align-items-center mt-30">
        <Link href="#" className="dash-btn-two tran3s me-3">
          Save
        </Link>
        <Link href="#" className="dash-cancel-btn tran3s">
          Cancel
        </Link>
      </div> */}
    </>
  );
};

export default observer(ProfileEditForm);
