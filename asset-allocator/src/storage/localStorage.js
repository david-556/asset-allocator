"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePortfolio = savePortfolio;
exports.loadPortfolio = loadPortfolio;
var portfolioStore_1 = require("./portfolioStore");
var PORTFOLIO_KEY = "portfolio";
var memoryStorage = {};
function getStorage() {
    if (typeof localStorage !== "undefined") {
        return localStorage;
    }
    return {
        getItem: function (key) { return (key in memoryStorage ? memoryStorage[key] : null); },
        setItem: function (key, value) {
            memoryStorage[key] = value;
        }
    };
}
function savePortfolio(state) {
    getStorage().setItem(PORTFOLIO_KEY, JSON.stringify(state));
}
function loadPortfolio() {
    var raw = getStorage().getItem(PORTFOLIO_KEY);
    if (!raw) {
        return portfolioStore_1.initialPortfolio;
    }
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return portfolioStore_1.initialPortfolio;
    }
}
