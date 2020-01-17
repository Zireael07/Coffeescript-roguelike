"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
var ViewBump = (function () {
    function ViewBump(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
    ViewBump.prototype.clone = function () {
        return new ViewBump(this.x, this.y, this.parent ? this.parent.clone() : undefined);
    };
    return ViewBump;
}());
//exports.ViewBump = ViewBump;

export { ViewBump }