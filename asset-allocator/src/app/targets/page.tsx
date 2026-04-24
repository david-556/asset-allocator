"use client";

import React, {useMemo, useState} from "react"
import styles from "./targets.module.css"
import type {Target} from "@/src/models/Target"
import type {AssetTarget} from "@/src/models/Target"
import { loadPortfolio, savePortfolio} from "@/src/storage/localStorage";
import {PortfolioState, setAssetTargets, setTargets} from "@/src/storage/portfolioStore"
import {
    allocationByType,
    calculateInvestmentDistribution,
    distributeAmongAssets,
    driftFromTarget,
    totalValue,
} from "@/src/services/portfolioCalculations"

const ASSET_TYPES: Target["assetType"][] = ["ETF", "Stock", "Crypto", "Cash"]

export default function TargetsPage() {
    const[portfolio, setPortfolio] = useState<PortfolioState>(loadPortfolio())
    const [investmentAmount, setInvestmentAmount] = useState("")

    const initialInputs = useMemo(() => {
        const map: Record<Target["assetType"], string> = {
            ETF: "",
            Stock: "",
            Crypto: "",
            Cash: "",
        };

        portfolio.targets.forEach((target: Target) => {
            map[target.assetType] = String(target.percent)
        });

        return map
    }, [portfolio.targets])

    const [targetInputs, setTargetInputs] = useState(initialInputs);

    const initialAssetInputs = useMemo(() => {
        const map: Record<string, string> = {}
        portfolio.assetTargets.forEach((t: AssetTarget) => {
            map[t.assetId] = String(t.percent)
        })
        return map
    }, [portfolio.assetTargets])

    const [assetTargetInputs, setAssetTargetInputs] = useState<Record<string, string>>(initialAssetInputs)

    const currentValuesByType = allocationByType(portfolio.assets);
    const total = totalValue(portfolio.assets)

    const currentPercentages: Record<string, number> = {}
    Object.entries(currentValuesByType).forEach(([type, value]) => {
        currentPercentages[type] = total > 0 ? (value/total) * 100 : 0;
    })

    const liveTargets: Target[] = ASSET_TYPES
        .map(assetType => ({
            assetType,
            percent: Number(targetInputs[assetType]) || 0,
        }))
        .filter(t => t.percent > 0)

    const drift =
        liveTargets.length > 0
        ? driftFromTarget(currentPercentages, liveTargets)
        : [];

    const typeDistribution =
        liveTargets.length > 0 && investmentAmount
        ? calculateInvestmentDistribution(
            Number(investmentAmount),
            currentValuesByType,
            liveTargets
        )
        : []

    const investmentPlan = useMemo(() => {
        if (!typeDistribution.length) return []
        return distributeAmongAssets(
            typeDistribution,
            portfolio.assets,
            portfolio.assetTargets,
            Number(investmentAmount) || 0
        )
    }, [typeDistribution, portfolio.assets, portfolio.assetTargets, investmentAmount])

    function handleTargetChange(
        assetType: Target["assetType"],
        value: string
    ) {
        setTargetInputs((prev: Record<Target["assetType"], string>) => ({
            ...prev,
            [assetType]: value,
        }))
    }

    function handleSaveTargets() {
        const newTargets: Target[] = ASSET_TYPES.map((assetType) => ({
            assetType,
            percent: Number(targetInputs[assetType]) || 0,
        }))

        const updated = setTargets(portfolio, newTargets)
        setPortfolio(updated)
        savePortfolio(updated)
    }

    function handleAssetTargetChange(assetId: string, value: string) {
        setAssetTargetInputs(prev => ({ ...prev, [assetId]: value }))
    }

    function handleSaveAssetTargets() {
        const newAssetTargets: AssetTarget[] = portfolio.assets
            .filter(a => assetTargetInputs[a.id] && Number(assetTargetInputs[a.id]) > 0)
            .map(a => ({
                assetId: a.id,
                percent: Number(assetTargetInputs[a.id]),
            }))

        const updated = setAssetTargets(portfolio, newAssetTargets)
        setPortfolio(updated)
        savePortfolio(updated)
    }

    const totalTargetPercent = ASSET_TYPES.reduce(
        (sum, type) => sum + (Number(targetInputs[type] || 0)),
        0
    )

    const totalAssetTargetPercent = portfolio.assets.reduce(
        (sum, a) => sum + (Number(assetTargetInputs[a.id] || 0)),
        0
    )

    const assetsByType = useMemo(() => {
        const map: Record<string, typeof portfolio.assets> = {}
        portfolio.assets.forEach(a => {
            if (!map[a.type]) map[a.type] = []
            map[a.type].push(a)
        })
        return map
    }, [portfolio.assets])

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <p className={styles.subtitle}>Portfolio Planning</p>
                    <h1 className={styles.title}>Targets</h1>
                </header>

                <section className={styles.card}>
                    <h2>Target Allocation</h2>
                    <div className={styles.formGrid}>
                        {ASSET_TYPES.map((type) => (
                            <div key={type} className={styles.field}>
                                <label className={styles.label}>{type}</label>
                                <input
                                    className={styles.input}
                                    type="number"
                                    value={targetInputs[type]}
                                    onChange={(e) => handleTargetChange(type, e.target.value)}
                                    />
                            </div>
                        ))}
                    </div>

                    <p style={{marginTop: "16px", color: "#9ca3af"}}>
                        Total: {totalTargetPercent}
                    </p>

                    <button
                        className={styles.button}
                        onClick={handleSaveTargets}
                        style={{marginTop: "16px"}}
                    >
                        Save Targets
                    </button>

                </section>

                {portfolio.assets.length > 0 && (
                    <section className={styles.card}>
                        <h2>Asset Targets</h2>
                        <p style={{color: "#6b7280", fontSize: "14px", marginBottom: "16px"}}>
                            Set a target % of your total portfolio for individual assets. Leave blank to skip.
                        </p>

                        {ASSET_TYPES.filter(type => assetsByType[type]?.length > 0).map(type => (
                            <div key={type} style={{marginBottom: "20px"}}>
                                <p style={{color: "#9ca3af", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px"}}>{type}</p>
                                <div className={styles.formGrid}>
                                    {assetsByType[type].map(asset => (
                                        <div key={asset.id} className={styles.field}>
                                            <label className={styles.label}>{asset.name}</label>
                                            <input
                                                className={styles.input}
                                                type="number"
                                                placeholder="e.g. 40"
                                                value={assetTargetInputs[asset.id] ?? ""}
                                                onChange={e => handleAssetTargetChange(asset.id, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <p style={{marginTop: "8px", color: "#9ca3af"}}>
                            Total: {totalAssetTargetPercent}%
                        </p>

                        <button
                            className={styles.button}
                            onClick={handleSaveAssetTargets}
                            style={{marginTop: "16px"}}
                        >
                            Save Asset Targets
                        </button>
                    </section>
                )}

                <section className={styles.card}>
                    <h2>Drift from Target</h2>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Current %</th>
                            <th>Target %</th>
                            <th>Drift</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drift.map((item) => (
                            <tr key={item.type} className={styles.row}>
                                <td>{item.type}</td>
                                <td>{item.current.toFixed(2)}%</td>
                                <td>{item.target.toFixed(2)}%</td>
                                <td className={item.drift >= 0 ? styles.positive : styles.negative}>
                                    {item.drift > 0 ? "+" : ""}
                                    {item.drift.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </section>

                <section className={styles.card}>
                    <h2>Investment Distribution</h2>

                    <div className={styles.field}>
                        <label className={styles.label}>Investment Amount (€)</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                        />
                    </div>

                    <table className={styles.table} style={{marginTop: "20px"}}>
                        <thead>
                            <tr>
                                <th>Type / Asset</th>
                                <th>Suggested Investment (€)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investmentPlan.map((row) => (
                                <React.Fragment key={row.type}>
                                    <tr className={styles.row}>
                                        <td style={{fontWeight: 600}}>{row.type}</td>
                                        <td style={{fontWeight: 600}}>{row.typeAmount.toFixed(2)}</td>
                                    </tr>
                                    {row.breakdown.map(asset => (
                                        <tr key={asset.assetId} className={styles.row}>
                                            <td style={{paddingLeft: "28px", color: "#9ca3af"}}>↳ {asset.assetName}</td>
                                            <td style={{color: "#9ca3af"}}>{asset.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    )
}
