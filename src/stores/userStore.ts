import { showGeneralError } from "@/utils/helpers";
import supabase from "@/utils/supabase";
import { action, makeAutoObservable, observable } from "mobx";

export default class UserStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable user: any = null;

  @action login = async (withError = false) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session) {
      this.user = session.user;
    } else if (withError) {
      showGeneralError(error?.message);
    }
  };

  @action setUser = (user: any) => {
    this.user = user;
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
