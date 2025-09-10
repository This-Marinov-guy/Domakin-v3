import { action, makeAutoObservable, observable } from "mobx"

export default class CommonStore {
  rootStore;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
  }

  @observable loading = false;
  @observable feedbackLoading = false;

  @observable feedbacks = [];

  @observable error = null;

  @action startLoading = () => {
    this.loading = true;
  }

  @action stopLoading = () => {
    this.loading = false;
  }

  @action toggleFeedbackLoading = () => {
    this.feedbackLoading = !this.feedbackLoading;
  }

  @action setFeedbacks = (feedbacks: []) => {
    this.feedbacks = feedbacks;
  }
  
  @action setSSRFeedbacks = (feedbacks: []) => {
    // For SSR data, set the feedbacks and ensure loading states are false
    this.feedbacks = feedbacks;
    this.feedbackLoading = false;
    this.loading = false;
  }
}
