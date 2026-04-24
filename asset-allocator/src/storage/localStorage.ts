/*to save data in browser */

import { PortfolioState, initialPortfolio } from "./portfolioStore";

const PORTFOLIO_KEY = "portfolio"
const memoryStorage: Record<string, string> = {}

type StorageLike = {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
}

function getStorage(): StorageLike {
    if (typeof localStorage !== "undefined") {
        return localStorage
    }

    return {
        getItem: (key: string) => (key in memoryStorage ? memoryStorage[key] : null),
        setItem: (key: string, value: string) => {
            memoryStorage[key] = value
        }
    }
}

export function savePortfolio(state: PortfolioState): void {
    getStorage().setItem(PORTFOLIO_KEY, JSON.stringify(state))
}

export function loadPortfolio(): PortfolioState {
    const raw = getStorage().getItem(PORTFOLIO_KEY)

    if(!raw) {
        return initialPortfolio
    }

    try {
        const parsed = JSON.parse(raw) as PortfolioState
        return {
            ...initialPortfolio,
            ...parsed,
        }
    } catch {
        return initialPortfolio
    }
}
