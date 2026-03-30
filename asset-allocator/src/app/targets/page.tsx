"use client";

import {useMemo, useState} from "react"
import styles from "./targets.module.css"
import type {Target} from "@/src/models/Target"
import { loadPortfolio, savePortfolio} from "@/src/storage/localStorage";
import {PortfolioState, setTargets} from "@/src/storage/portfolioStore"
import {
    allocationByType,
    calculateInvestmentDistribution,
    driftFromTarget,
    totalValue,
} from "@/src/services/portfolioCalculations"
import Link from "next/link"

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

    const currentValuesByType = allocationByType(portfolio.assets); 
    const total = totalValue(portfolio.assets)

    const currentPercentages: Record<string, number> = {}
    Object.entries(currentValuesByType).forEach(([type, value]) => {
        currentPercentages[type] = total > 0 ? (value/total) * 100 : 0; 
    })

    const drift = 
        portfolio.targets.length > 0
        ? driftFromTarget(currentPercentages, portfolio.targets)
        : []; 

        const investmentPlan = 
            portfolio.targets.length > 0 && investmentAmount
            ? calculateInvestmentDistribution(
                Number(investmentAmount),
                currentValuesByType,
                portfolio.targets
            )
            : []

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

    const totalTargetPercent = ASSET_TYPES.reduce(
        (sum, type) => sum + (Number(targetInputs[type] || 0)),
        0
    )

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <p className={styles.subtitle}>Portfolio Planning</p>
                    <h1 className={styles.title}>Targets</h1>
                    <p>
                    <Link href="/">Go to Dashboard</Link>
                    </p>
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
                                <th>Type</th>
                                <th>Suggested Investment (€)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investmentPlan.map((item) => (
                                <tr key={item.type} className={styles.row}>
                                    <td>{item.type}</td>
                                    <td>{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    )
}
