"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
var View = (function () {
    function View(shallowLine, steepLine, shallowBump, steepBump) {
        this.shallowLine = shallowLine;
        this.steepLine = steepLine;
        this.shallowBump = shallowBump;
        this.steepBump = steepBump;
    }
    View.prototype.clone = function () {
        return new View(this.shallowLine.clone(), this.steepLine.clone(), this.shallowBump ? this.shallowBump.clone() : undefined, this.steepBump ? this.steepBump.clone() : undefined);
    };
    return View;
}());
//exports.View = View;

export { View }