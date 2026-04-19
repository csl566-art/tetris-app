import { PIECE_KEYS } from './pieces.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createBag() {
  return shuffle([...PIECE_KEYS]);
}

export class RandomBag {
  constructor() {
    this.bag = [];
  }

  next() {
    if (this.bag.length === 0) {
      this.bag = createBag();
    }
    return this.bag.pop();
  }

  peek(count) {
    while (this.bag.length < count) {
      this.bag = [...createBag(), ...this.bag];
    }
    return this.bag.slice(this.bag.length - count).reverse();
  }
}
