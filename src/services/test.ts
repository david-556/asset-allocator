import { totalValue, allocationByType, percentageByType, driftFromTarget } from "./portfolioCalculations"
import { Target } from "../models/Target"
import { Asset } from "../models/Asset"

const assets: Asset[] = [
    {id: "1", name: "MSCI World", type: "ETF", value: 7000},
    {id: "2", name: "EM ETF", type: "ETF", value: 2000}, 
    {id: "3", name: "BYD", type: "Stock", value: 1000}
]

const targets: Target[] = [
    {assetType: "ETF", percent: 70},
    {assetType: "Stock", percent: 20},
    {assetType: "Crypto", percent: 10}
]

const currentPercent = {ETF: 90, Stock: 10}

console.log("Drift:", driftFromTarget(currentPercent, targets))
console.log("Total Value:", totalValue(assets))
console.log("Allocation:", allocationByType(assets))
console.log("Percentages:", percentageByType(assets))

