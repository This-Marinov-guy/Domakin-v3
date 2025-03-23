import { showGeneralError, showGeneralSuccess } from "@/utils/helpers";
import supabase from "@/utils/supabase";
import axios from "axios";
import { profile } from "console";
import { action, makeAutoObservable, observable } from "mobx";

export default class UserStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable userLoading = true;
  @observable user: any = null;
  @observable editUser = {
    profileImage: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  };
  @observable editUserLoading = false;
  @observable editUserErrors = [];

  @action login = async (withError = false) => {
    this.setUserLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session) {
      this.setUser(session);
    } else if (withError) {
      showGeneralError(error?.message);
    }

    this.setUserLoading(false);
  };

  setUserLoading = (loading: boolean) => {
    this.userLoading = loading;
  };

  @action setUser = (session: any) => {
    this.user = {
      id: session.user.id,
      email: session.user.email,
      phone: session.user.phone,
      token: session.access_token,
      name: session.user.user_metadata.display_name,
      profileImage:
        session.user.user_metadata.avatar_url ||
        "/assets/img/dashboard/avatar_01.jpg",
    };
  };

  @action updateUserDetails = (
    name: keyof typeof this.editUser,
    value: any
  ) => {
    this.editUser[name] = value;
  };

  @action loadUserEditDetails = () => {
    this.editUser = {
      ...this.editUser,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      password: "",
      password_confirmation: "",
    };
  };

  @action updateProfile = async () => {
    this.editUserLoading = true;
    this.editUserErrors = [];

    try {
      const formData = new FormData();
      for (const key in this.editUser) {
        if (this.editUser[key as keyof typeof this.editUser]) {
          formData.append(
            key,
            this.editUser[key as keyof typeof this.editUser]
          );
        }

        const responseData = await axios.post("/api/user/update", formData);

        if (responseData?.data.message) {
          showGeneralError(responseData.data.message);
        }

        if (responseData?.data.status) {
          this.user = {
            ...this.user,
            profileImage: responseData.data.profileImage,
            name: responseData.data.name,
            email: responseData.data.email,
            phone: responseData.data.phone,
          };

          showGeneralSuccess();
        } else if (responseData?.data.errors) {
          this.editUserErrors = responseData.data.errors;
        }
      }
    } catch (error: any) {
      showGeneralError(error.message);
    } finally {
      this.editUserLoading = false;
    }
  };

  @action logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showGeneralError(error.message);
    } else {
      this.user = null;
    }
  };
}
