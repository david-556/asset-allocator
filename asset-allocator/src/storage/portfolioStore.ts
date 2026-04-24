import { Asset } from "../models/Asset"
import { AssetTarget, Target } from "../models/Target"

export type PortfolioState = {
    assets: Asset[]
    targets: Target[]
    assetTargets: AssetTarget[]
}

export const initialPortfolio: PortfolioState = {
    assets: [],
    targets: [],
    assetTargets: [],
}

export function addAsset(state: PortfolioState, asset: Asset): PortfolioState {
    return {
        ...state,
        assets: [...state.assets, asset]
    }
}

export function deleteAsset(state: PortfolioState, id: string): PortfolioState {
    return {
        ...state,
        assets: state.assets.filter(a => a.id !== id)
    }
}

export function updateAsset(state: PortfolioState, updated: Asset): PortfolioState {
    return {
        ...state,
        assets: state.assets.map(a => a.id === updated.id ? updated : a)
    }
}

export function setTargets(state: PortfolioState, targets: Target[]): PortfolioState {
    return {
        ...state,
        targets
    }
}

export function setAssetTargets(state: PortfolioState, assetTargets: AssetTarget[]): PortfolioState {
    return {
        ...state,
        assetTargets
    }
}
