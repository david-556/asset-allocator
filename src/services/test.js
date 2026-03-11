"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var portfolioCalculations_1 = require("./portfolioCalculations");
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
console.log("Drift:", (0, portfolioCalculations_1.driftFromTarget)(currentPercent, targets));
console.log("Total Value:", (0, portfolioCalculations_1.totalValue)(assets));
console.log("Allocation:", (0, portfolioCalculations_1.allocationByType)(assets));
console.log("Percentages:", (0, portfolioCalculations_1.percentageByType)(assets));
