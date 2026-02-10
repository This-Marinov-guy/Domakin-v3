import { makeAutoObservable } from "mobx";

export default class ListRoomStore {
  rootStore: any;

  steps: number[] = [1, 2, 3, 4, 5, 6];

  currentStepIndex = 0;
  isCompleteForm = false;
  showDraftModal = false;

  constructor(root: any) {
    this.rootStore = root;
    makeAutoObservable(this);
  }

  get currentStep(): number {
    return this.steps[this.currentStepIndex] ?? 1;
  }

  get isLast() {
    return this.currentStepIndex >= this.steps.length - 1;
  }

  next = () => {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex += 1;
    }
  };

  back = () => {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex -= 1;
    }
  };

  goTo = (index: number) => {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
    }
  };

  setCompleteForm = (value: boolean) => {
    this.isCompleteForm = value;
  };

  openDraftModal = () => {
    this.showDraftModal = true;
  };

  closeDraftModal = () => {
    this.showDraftModal = false;
  };

  reset = () => {
    this.currentStepIndex = 0;
    this.isCompleteForm = false;
    this.showDraftModal = false;
  };
}

