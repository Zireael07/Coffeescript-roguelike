// Generated by CoffeeScript 2.5.0
//based on https://eskerda.com/bsp-dungeon-generation/
var Tree, random_split, split_container;

import {
  State
} from './js_game_vars.js';

import {
  Rect
} from './map_common.js';

Tree = class Tree {
  constructor(leaf) {
    this.leaf = leaf;
    this.lchild = void 0;
    this.rchild = void 0;
  }

  get_leafs() {
    if (this.lchild === void 0 && this.rchild === void 0) {
      return this.leaf;
    } else {
      return [].concat(this.lchild.get_leafs(), this.rchild.get_leafs());
    }
  }

  get_level(level, queue) {
    if (queue === void 0) {
      queue = [];
    }
    if (level === 1) {
      queue.push(this);
    } else {
      if (this.lchild !== void 0) {
        this.lchild.get_level(level - 1, queue);
      }
      if (this.rchild !== void 0) {
        this.rchild.get_level(level - 1, queue);
      }
    }
    return queue;
  }

};

random_split = function(rect, discard = false, w_ratio = 0.45, h_ratio = 0.45) {
  var r1, r1_h_ratio, r1_w_ratio, r2, r2_h_ratio, r2_w_ratio;
  r1 = null;
  r2 = null;
  if (State.rng.range(0, 1) === 0) {
    console.log("Split vertical");
    // Vertical
    r1 = new Rect(rect.x1, rect.y1, State.rng.range(1, rect.w), rect.h); // r1.x, r1.y // r1.w, r1.h # ensure a margin
    r2 = new Rect(rect.x1 + r1.w, rect.y1, rect.w - r1.w, rect.h); // r2.x, r2.y // r2.w, r2.h
    //console.log(r1)
    //console.log(r2)
    if (discard) {
      r1_w_ratio = r1.w / r1.h;
      r2_w_ratio = r2.w / r2.h;
      if (r1_w_ratio < w_ratio || r2_w_ratio < w_ratio) {
        return random_split(rect, discard);
      }
    }
  } else {
    // Horizontal
    console.log("Split horizontal");
    r1 = new Rect(rect.x1, rect.y1, rect.w, State.rng.range(1, rect.h)); // r1.x, r1.y // r1.w, r1.h # ensure a margin
    r2 = new Rect(rect.x1, rect.y1 + r1.h, rect.w, rect.h - r1.h); // r2.x, r2.y // r2.w, r2.h
    //console.log(r1)
    //console.log(r2)
    if (discard) {
      r1_h_ratio = r1.h / r1.w;
      r2_h_ratio = r2.h / r2.w;
      if (r1_h_ratio < h_ratio || r2_h_ratio < h_ratio) {
        return random_split(rect, discard);
      }
    }
  }
  return [r1, r2];
};

split_container = function(container, iter, discard) {
  var root, sr;
  root = new Tree(container);
  if (iter !== 0) {
    sr = random_split(container, discard);
    root.lchild = split_container(sr[0], iter - 1, discard);
    root.rchild = split_container(sr[1], iter - 1, discard);
  }
  return root;
};

export {
  Tree,
  split_container
};
