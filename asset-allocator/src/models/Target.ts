export type Target = {
    assetType: "ETF" | "Stock" | "Crypto" | "Cash"
    percent: number
}

export type AssetTarget = {
    assetId: string
    percent: number
}
