"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
var Line = (function () {
    function Line(nearX, nearY, farX, farY) {
        this.nearX = nearX;
        this.nearY = nearY;
        this.farX = farX;
        this.farY = farY;
        this.deltaX = farX - nearX;
        this.deltaY = farY - nearY;
    }
    Line.prototype.clone = function () {
        return new Line(this.nearX, this.nearY, this.farX, this.farY);
    };
    Line.prototype.setNearPoint = function (nearX, nearY) {
        this.nearX = nearX;
        this.nearY = nearY;
        this.deltaX = this.farX - this.nearX;
        this.deltaY = this.farY - this.nearY;
    };
    Line.prototype.setFarPoint = function (farX, farY) {
        this.farX = farX;
        this.farY = farY;
        this.deltaX = this.farX - this.nearX;
        this.deltaY = this.farY - this.nearY;
    };
    Line.prototype.isBelow = function (x, y) {
        return this.calculateRelativeSlope(x, y) > 0;
    };
    Line.prototype.isBelowOrCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) >= 0;
    };
    Line.prototype.isAbove = function (x, y) {
        return this.calculateRelativeSlope(x, y) < 0;
    };
    Line.prototype.isAboveOrCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) <= 0;
    };
    Line.prototype.isCollinear = function (x, y) {
        return this.calculateRelativeSlope(x, y) === 0;
    };
    Line.prototype.isLineCollinear = function (line) {
        return this.isCollinear(line.nearX, line.nearY) && this.isCollinear(line.farX, line.farY);
    };
    Line.prototype.calculateRelativeSlope = function (x, y) {
        return this.deltaY * (this.farX - x) - this.deltaX * (this.farY - y);
    };
    return Line;
}());
//exports.Line = Line;
export {Line}