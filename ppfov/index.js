"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
// var View_1 = require("./View");
// var Line_1 = require("./Line");
// var Point_1 = require("./Point");
// var ViewBump_1 = require("./ViewBump");

import { View } from "./View.js";
import { Line } from "./Line.js";
import { Point } from "./Point.js";
import { ViewBump } from "./ViewBump.js";

var PermissiveFov = (function () {
    function PermissiveFov(mapWidth, mapHeight, isTransparent) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.isTransparent = isTransparent;
    }
    PermissiveFov.prototype.compute = function (startX, startY, radius, setVisible) {
        var data = {
            setVisible: setVisible,
            isTransparent: this.isTransparent,
            startX: startX,
            startY: startY,
            radius: radius,
            visited: []
        };
        data.setVisible(startX, startY);
        data.visited[this.mapWidth * startY + startX] = true;
        var minExtentX = (startX < radius ? startX : radius);
        var maxExtentX = (this.mapWidth - startX <= radius ? this.mapWidth - startX - 1 : radius);
        var minExtentY = (startY < radius ? startY : radius);
        var maxExtentY = (this.mapHeight - startY <= radius ? this.mapHeight - startY - 1 : radius);
        this.computeQuadrant(data, 1, 1, maxExtentX, maxExtentY);
        this.computeQuadrant(data, 1, -1, maxExtentX, minExtentY);
        this.computeQuadrant(data, -1, -1, minExtentX, minExtentY);
        this.computeQuadrant(data, -1, 1, minExtentX, maxExtentY);
    };
    ;
    PermissiveFov.prototype.setMapDimensions = function (mapWidth, mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    };
    ;
    PermissiveFov.prototype.setIsTransparent = function (isTransparent) {
        this.isTransparent = isTransparent;
    };
    ;
    PermissiveFov.prototype.computeQuadrant = function (data, deltaX, deltaY, maxX, maxY) {
        var activeViews = [];
        var startJ;
        var maxJ;
        var maxI = maxX + maxY;
        var shallowLine = new Line(0, 1, maxX, 0);
        var steepLine = new Line(1, 0, 0, maxY);
        var viewIndex = 0;
        activeViews.push(new View(shallowLine, steepLine));
        for (var i = 1; i <= maxI && activeViews.length; ++i) {
            startJ = (0 > i - maxX ? 0 : i - maxX);
            maxJ = (i < maxY ? i : maxY);
            for (var j = startJ; j <= maxJ && viewIndex < activeViews.length; ++j) {
                this.visitPoint(data, i - j, j, deltaX, deltaY, viewIndex, activeViews);
            }
        }
    };
    PermissiveFov.prototype.visitPoint = function (data, x, y, deltaX, deltaY, viewIndex, activeViews) {
        var topLeft = new Point(x, y + 1);
        var bottomRight = new Point(x + 1, y);
        var realX = x * deltaX;
        var realY = y * deltaY;
        for (; viewIndex < activeViews.length &&
            activeViews[viewIndex].steepLine.isBelowOrCollinear(bottomRight.x, bottomRight.y); ++viewIndex) {
        }
        if (viewIndex === activeViews.length ||
            activeViews[viewIndex].shallowLine.isAboveOrCollinear(topLeft.x, topLeft.y)) {
            return;
        }
        var visitedPoint = new Point(data.startX + realX, data.startY + realY);
        var visitedPointIndex = this.mapWidth * visitedPoint.y + visitedPoint.x;
        if (!data.visited[visitedPointIndex]) {
            data.visited[visitedPointIndex] = true;
            data.setVisible(visitedPoint.x, visitedPoint.y);
        }
        if (data.isTransparent(visitedPoint.x, visitedPoint.y)) {
            return;
        }
        var shallowLineIsAboveBottomRight = activeViews[viewIndex].shallowLine.isAbove(bottomRight.x, bottomRight.y);
        var steepLineIsBelowTopLeft = activeViews[viewIndex].steepLine.isBelow(topLeft.x, topLeft.y);
        if (shallowLineIsAboveBottomRight && steepLineIsBelowTopLeft) {
            activeViews.splice(viewIndex, 1);
        }
        else if (shallowLineIsAboveBottomRight) {
            this.addShallowBump(topLeft.x, topLeft.y, activeViews, viewIndex);
            this.checkView(activeViews, viewIndex);
        }
        else if (steepLineIsBelowTopLeft) {
            this.addSteepBump(bottomRight.x, bottomRight.y, activeViews, viewIndex);
            this.checkView(activeViews, viewIndex);
        }
        else {
            var shallowViewIndex = viewIndex;
            var steepViewIndex = ++viewIndex;
            activeViews.splice(shallowViewIndex, 0, activeViews[shallowViewIndex].clone());
            this.addSteepBump(bottomRight.x, bottomRight.y, activeViews, shallowViewIndex);
            if (!this.checkView(activeViews, shallowViewIndex)) {
                --steepViewIndex;
            }
            this.addShallowBump(topLeft.x, topLeft.y, activeViews, steepViewIndex);
            this.checkView(activeViews, steepViewIndex);
        }
    };
    PermissiveFov.prototype.addShallowBump = function (x, y, activeViews, viewIndex) {
        activeViews[viewIndex].shallowLine.setFarPoint(x, y);
        activeViews[viewIndex].shallowBump = new ViewBump(x, y, activeViews[viewIndex].shallowBump);
        for (var curBump = activeViews[viewIndex].steepBump; curBump; curBump = curBump.parent) {
            if (activeViews[viewIndex].shallowLine.isAbove(curBump.x, curBump.y)) {
                activeViews[viewIndex].shallowLine.setNearPoint(curBump.x, curBump.y);
            }
        }
    };
    PermissiveFov.prototype.addSteepBump = function (x, y, activeViews, viewIndex) {
        activeViews[viewIndex].steepLine.setFarPoint(x, y);
        activeViews[viewIndex].steepBump = new ViewBump(x, y, activeViews[viewIndex].steepBump);
        for (var curBump = activeViews[viewIndex].shallowBump; curBump; curBump = curBump.parent) {
            if (activeViews[viewIndex].steepLine.isBelow(curBump.x, curBump.y)) {
                activeViews[viewIndex].steepLine.setNearPoint(curBump.x, curBump.y);
            }
        }
    };
    PermissiveFov.prototype.checkView = function (activeViews, viewIndex) {
        if (activeViews[viewIndex].shallowLine.isLineCollinear(activeViews[viewIndex].steepLine) &&
            (activeViews[viewIndex].shallowLine.isCollinear(0, 1)
                || activeViews[viewIndex].shallowLine.isCollinear(1, 0))) {
            activeViews.splice(viewIndex, 1);
            return false;
        }
        return true;
    };
    return PermissiveFov;
}());
//exports.PermissiveFov = PermissiveFov;

export { PermissiveFov }