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

export function calculateInvestmentDistribution(
    amount: number,
    currentValuesByType: Record<string, number>,
    targets: Target[]
) {

    const total = Object.keys(currentValuesByType).reduce(
        (s, key) => s + currentValuesByType[key],
        0
    )

    //if portfolio is empty, just split by target %
    if (total <= 0) {
        return targets.map(t => ({
            type: t.assetType,
            amount: round2((amount * t.percent) / 100)
        }))
    }

    //How much each type "should" have after investing amount
    const desiredTotal = total + amount

    const gaps = targets.map(t => {
        const current = currentValuesByType[t.assetType] || 0
        const desired = (desiredTotal * t.percent) / 100
        const gap = Math.max(0, desired - current) // only invest into underweight categories
        return {type: t.assetType, gap}
    })

    const totalGap = gaps.reduce((s,g) => s + g.gap, 0)

    //If nothing is underweight (or rounding), then fallback to target split
    if(totalGap <= 0) {
        return targets.map(t => ({
            type: t.assetType,
            amount: round2((amount * t.percent) / 100)
        }))
    }

    // Distribute amount proportionally to gaps
    let distribution = gaps.map(g => ({
        type: g.type,
        amount: round2((amount * g.gap) / totalGap)
    }))

    //Fix rounding so amounts sum exactly to 'amount' (in cents)
    distribution = fixRounding(distribution, amount)

    return distribution

}

//function for the dashboard
export function percentageByType(assets: Asset[]) {
    const values = allocationByType(assets)
    const total = totalValue(assets)

    const result: Record<string, number> = {}

    for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
            const value = values[key]
            result[key] = (value / total) * 100
        }
    }

    return result
}

function fixRounding(
    items: { type: Target["assetType"]; amount: number }[],
    total: number
) {
    const toCents = (x: number) => Math.round(x * 100)
    const fromCents = (x: number) => x / 100

    const targetCents = toCents(total)
    const sumCents = items.reduce((s,i) => s + toCents(i.amount), 0)
    let diff = targetCents - sumCents

    if(diff == 0) return items

    //Add/subtract the diff to the largest allocation (simple + stable)
    let maxIdx = 0
    for (let i = 1; i < items.length; i++) {
        if (items[i].amount > items[maxIdx].amount) maxIdx = i
    }

    const updated = [...items]
    updated[maxIdx] = {
        ...updated[maxIdx],
        amount: fromCents(toCents(updated[maxIdx].amount) + diff)
    }

    return updated
}

function round2(value: number) {
    return Math.round(value * 100) / 100
}
