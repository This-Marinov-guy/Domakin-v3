import { showGeneralError } from "@/utils/helpers";
import supabase from "@/utils/supabase";
import { action, makeAutoObservable, observable } from "mobx";

export default class UserStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable userLoading = true;
  @observable user: any = null;

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

  @action logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showGeneralError(error.message);
    } else {
      this.user = null;
    }
  };
}
