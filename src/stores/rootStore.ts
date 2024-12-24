import CommonStore from './commonStore';
import UserStore from './userStore';

class RootStore {
    commonStore;
    userStore;

    constructor() {
        this.commonStore = new CommonStore(this);
        this.userStore = new UserStore(this);
    }
}

export const rootStore = new RootStore();