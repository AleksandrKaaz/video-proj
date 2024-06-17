import { makeAutoObservable } from 'mobx';
import { Timestamp } from '../types/timestamp';

class TimestampStore {
  timestamps: Timestamp[] | null = null;
  currentTimestampIndex: number = 0;
  timeUpdateRAFId: number = 0;
  displayedItems: Timestamp[] = [];
  selectedItem: Timestamp | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTimestamps = (items: Timestamp[]) => {
    this.timestamps = items;
  };

  setSelectedItem = (item: Timestamp) => {
    this.selectedItem = item;
  };

  setCurrentTimestampIndex = (currentIndex: number) => {
    this.currentTimestampIndex = currentIndex;
  };

  setTimeUpdateRAFId = (currentNumber: number) => {
    this.timeUpdateRAFId = currentNumber;
  };
}

export let timestampStore = new TimestampStore();
