import { SERVER_ENDPOINT } from "@/utils/config";
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
  @observable editUserErrors: string[] = [];

  @action login = async (withError = false) => {
    this.setUserLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session) {
      await this.setUser(session);
    } else if (withError) {
      showGeneralError(error?.message);
    }

    this.setUserLoading(false);
  };

  setUserLoading = (loading: boolean) => {
    this.userLoading = loading;
  };

  @action setUser = async (session: any) => {
    const { data } =
      (await supabase
        .from("users")
        .select("phone")
        .eq("id", session.user.id)
        .single()) ?? {};

    this.user = {
      ...data,
      id: session.user.id,
      email: session.user.email,
      token: session.access_token,
      name: session.user.user_metadata.display_name ?? '-',
      profileImage:
        session.user.user_metadata.avatar_url ||
        "/assets/img/dashboard/avatar_01.jpg",
    };    
  };

  @action updateUser = (data: any) => {
    this.user = {
      ...this.user,
      ...data,
    };
  };

  @action updateUserDetails = (
    name: keyof typeof this.editUser,
    value: any
  ) => {
    this.editUser[name] = value;
  };

  @action setUpdateErrors = (errors: any) => {
    this.editUserErrors = errors;
  }

  @action loadUserEditDetails = () => {
    if (!this.user) return;    

    this.editUser = {
      ...this.editUser,
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      password: "",
      password_confirmation: "",
    };
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
