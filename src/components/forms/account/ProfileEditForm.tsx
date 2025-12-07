import UserAvatarSetting from "@/components/dashboard/profile/UserAvatarSetting";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import avatar_1 from "@/assets/images/dashboard/avatar_02.jpg";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import Spinner from "react-bootstrap/esm/Spinner";
import {
  resizeFile,
  showGeneralError,
  showGeneralSuccess,
} from "@/utils/helpers";
import { useServer } from "@/hooks/useServer";

const ProfileEditForm = () => {
  const { userStore } = useStore();
  const {
    user,
    editUser,
    updateUserDetails,
    updateUser,
    setUpdateErrors,
    refreshSession,
  } = userStore;

  const { sendRequest } = useServer();

  const [imagePreview, setImagePreview] = useState<StaticImageData | string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImagePreview(user?.profileImage);
  }, [user]);

  const handleImageChange = async (event: any) => {
    const file = await resizeFile(event.target.files[0], 300, 300);

    if (file && file instanceof Blob) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      updateUserDetails("profileImage", file);
    }
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setUpdateErrors([]);

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

      if (responseData?.status) {
        updateUser({
          profileImage: responseData.data.user.profile_image,
          firstName: responseData.data.user.first_name || responseData.data.user.name?.split(" ")[0] || "",
          lastName: responseData.data.user.last_name || responseData.data.user.name?.split(" ").slice(1).join(" ") || "",
          name: responseData.data.user.name,
          email: responseData.data.user.email,
          phone: responseData.data.user.phone,
        });

        showGeneralSuccess();
      } else if (responseData?.invalid_fields) {
        setUpdateErrors(responseData.invalid_fields);
      }
    } catch (error: any) {
      showGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            Photo
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
            {loading ? <Spinner size='sm' animation="border"/> : "Save"}
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
