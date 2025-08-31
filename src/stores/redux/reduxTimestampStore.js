import { createStore } from 'redux';

const defaultState = {
  timestamps: null,
  currentTimestampIndex: 0,
  timeUpdateRAFId: 0,
  displayedItems: [],
  selectedItem: null,
};

export const timestampReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_TIMESTAMPS':
      return { ...state, timestamps: [...action.payload] };
    case 'SET_CURRENTTIMESTAMPINDEX':
      return { ...state, currentTimestampIndex: action.payload };
    case 'SET_TIMEUPDATERAFID':
      return { ...state, timeUpdateRAFId: action.payload };
    case 'ADD_TO_DISPLAYEDITEMS':
      console.log(action.payload, 'payload');
      return { ...state, displayedItems: [...state.displayedItems, action.payload] };
    case 'REMOVE_FROM_DISPLAYEDITEMS':
      return {
        ...state,
        displayedItems: state.displayedItems.slice(1),
      };
    case 'SET_SELECTEDITEM':
      return { ...state, selectedItem: action.payload };
    default:
      return state;
  }
};

export const store = createStore(timestampReducer);
