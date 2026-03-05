import { Asset } from "../models/Asset"
import { Target } from "../models/Target"


/**
 * Calulcates total portfolio value
 */

export function totalValue(assets: Asset[]) {
    return assets.reduce((sum, a) => sum + a.value, 0)
}

/**
 * groups the portfolio value by asset type
 */

export function allocationByType(assets: Asset[]) {
    const result: Record<string, number> = {}

    assets.forEach(a => {
        result[a.type] = (result[a.type] || 0) + a.value
    })

    return result
}

/**
 * Calculates drift from one asset 
 */

export function driftFromTarget(current: Record<string, number>, targets: Target[]) {
    const result: {
        type: Target["assetType"]
        current: number
        target: number
        drift: number
    }[] = []

    targets.forEach(t => {
        const currentPercent = current[t.assetType] || 0
        const drift = currentPercent - t.percent
        
        result.push({
            type: t.assetType,
            current: currentPercent,
            target: t.percent,
            drift: drift
        })
     })

     return result
}

