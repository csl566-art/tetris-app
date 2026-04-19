import { create } from 'zustand';
import { initState, gameReducer, fallInterval } from '../engine/gameEngine.js';

export const useGameStore = create((set, get) => ({
  ...initState(),

  dispatch(action) {
    set(state => gameReducer(state, action));
  },

  getFallInterval() {
    return fallInterval(get().level);
  },
}));
