export type Asset = {
    id: string
    name: string
    type: "ETF" | "Stock" | "Crypto" | "Cash"
    value: number 
}
