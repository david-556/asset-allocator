"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialPortfolio = void 0;
exports.addAsset = addAsset;
exports.deleteAsset = deleteAsset;
exports.updateAsset = updateAsset;
exports.setTargets = setTargets;
exports.initialPortfolio = {
    assets: [],
    targets: []
};
function addAsset(state, asset) {
    return __assign(__assign({}, state), { assets: __spreadArray(__spreadArray([], state.assets, true), [asset], false) });
}
function deleteAsset(state, id) {
    return __assign(__assign({}, state), { assets: state.assets.filter(function (a) { return a.id !== id; }) });
}
function updateAsset(state, updated) {
    return __assign(__assign({}, state), { assets: state.assets.map(function (a) { return a.id === updated.id ? updated : a; }) });
}
function setTargets(state, targets) {
    return __assign(__assign({}, state), { targets: targets });
}
