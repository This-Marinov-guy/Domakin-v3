import { SERVER_ENDPOINT } from "@/utils/config";
import {
  convertKeysToCamelCase,
  showGeneralError,
  showGeneralSuccess,
  snakeToCamelCase,
} from "@/utils/helpers";
import supabase from "@/utils/supabase";
import axios from "axios";
import { profile } from "console";
import { action, computed, makeAutoObservable, observable } from "mobx";

export default class UserStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable referralCode = "";

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

    return !!session;
  };

  setUserLoading = (loading: boolean) => {
    this.userLoading = loading;
  };

  @action refreshSession = async () => {
    if (!this.user) return;

    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (!error && session) {
      this.user = {
        ...this.user,
        token: session.access_token,
      };

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.access_token}`;
    }
  };

  @action setUser = async (session: any) => {
    const { data } = (await supabase
      .from("users")
      .select("phone, profile_image, status, roles, name, email")
      .eq("id", session.user.id)
      .single()) ?? {
      phone: "",
      profileImage: session.user.user_metadata.avatar_url,
    };

    this.user = {
      ...convertKeysToCamelCase(data),
      id: session.user.id,
      token: session.access_token,
    };

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.access_token}`;
  };

  @action loadReferralCode = async () => {
    const { data } = (await supabase
      .from("users")
      .select("referral_code")
      .eq("id", this.user.id)
      .single()) ?? {
      data: { referral_code: "" },
    };

    this.referralCode = data?.referral_code || "";
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
  };

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
      delete axios.defaults.headers.common["Authorization"];
      this.user = null;
    }
  };

  @computed get isAdmin() {
    return this.user?.roles?.includes("admin") || false;
  }

  @computed get isUserFullySet() {
    return (
      !!this.user?.name &&
      !!this.user?.surname &&
      !!this.user?.phone &&
      !!this.user?.email
    );
  }
}
