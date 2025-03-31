import UserAvatarSetting from "@/components/dashboard/profile/UserAvatarSetting";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import avatar_1 from "@/assets/images/dashboard/avatar_02.jpg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import Spinner from "react-bootstrap/esm/Spinner";
import { showGeneralError, showGeneralSuccess } from "@/utils/helpers";
import { useServer } from "@/hooks/useServer";

const ProfileEditForm = () => {
  const { userStore } = useStore();
  const { user, editUser, updateUserDetails, updateUser } = userStore;

  const { sendRequest } = useServer();

  const [imagePreview, setImagePreview] = useState<StaticImageData | string>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setImagePreview(user?.profileImage);
  }, [user]);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      updateUserDetails("profileImage", file);
    }
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      for (const key in editUser) {
        if (editUser[key as keyof typeof editUser]) {
          formData.append(key, editUser[key as keyof typeof editUser]);
        }
      }

      const responseData = await sendRequest(
        "/user/edit-details",
        "POST",
        formData
      );

      if (responseData?.message) {
        showGeneralError(responseData.data.message);
      }

      if (responseData?.status) {
        updateUser({
          profileImage: responseData.profileImage,
          name: responseData.name,
          email: responseData.email,
          phone: responseData.phone,
        });

        showGeneralSuccess();
      } else if (responseData?.errors) {
        setErrors(responseData.errors);
      }
    } catch (error: any) {
      showGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="main-title d-block d-lg-none">Profile</h2>
      <div className="bg-white card-box border-20">
        <div className="user-avatar-setting d-flex align-items-center mb-30">
          <Image
            src={imagePreview ?? avatar_1}
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
            disabled={loading}
            onClick={handleSubmit}
            className="dash-btn-two tran3s me-3"
          >
            {loading ? <Spinner /> : "Save"}
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
