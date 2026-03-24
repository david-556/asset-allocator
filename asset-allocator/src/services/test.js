"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var portfolioStore_1 = require("../storage/portfolioStore");
var localStorage_1 = require("../storage/localStorage");
var assets = [
    { id: "1", name: "MSCI World", type: "ETF", value: 7000 },
    { id: "2", name: "EM ETF", type: "ETF", value: 2000 },
    { id: "3", name: "BYD", type: "Stock", value: 1000 }
];
var targets = [
    { assetType: "ETF", percent: 70 },
    { assetType: "Stock", percent: 20 },
    { assetType: "Crypto", percent: 10 }
];
var currentPercent = { ETF: 90, Stock: 10 };
var portfolio = (0, localStorage_1.loadPortfolio)();
portfolio = (0, portfolioStore_1.addAsset)(portfolio, {
    id: "1",
    name: "MSCI World",
    type: "ETF",
    value: 7000
});
(0, localStorage_1.savePortfolio)(portfolio);
/*console.log("Drift:", driftFromTarget(currentPercent, targets))
console.log("Total Value:", totalValue(assets))
console.log("Allocation:", allocationByType(assets))
console.log("Percentages:", percentageByType(assets)) */
console.log(portfolio);
