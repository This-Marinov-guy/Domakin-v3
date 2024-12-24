import { action, makeAutoObservable, observable } from "mobx"

export default class CommonStore {
    rootStore;
    
    constructor(root: any) {
        makeAutoObservable(this)
        this.rootStore = root
    }
    
    @observable loading = false;

    @action setLoading(loading: boolean) {
        this.loading = loading
    }

}
