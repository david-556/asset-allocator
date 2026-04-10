"use client"; 

import { useEffect, useState } from "react"
import { loadPortfolio } from "../storage/localStorage";
import { initialPortfolio, PortfolioState } from "../storage/portfolioStore";
import { totalValue, allocationByType, percentageByType } from "../services/portfolioCalculations";
import AllocationPieChart from "../components/AllocationPieChart";
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioState>(initialPortfolio)
  const[view, setView] = useState<"asset" | "type">("type");

  useEffect(() => {
    setPortfolio(loadPortfolio())
  }, [])

  const total = totalValue(portfolio.assets)
  const byType = allocationByType(portfolio.assets)
  const percentages = percentageByType(portfolio.assets)

  const assetChartData = portfolio.assets.map((asset) => ({
    name: asset.name,
    value: asset.value,
  }))

  const typeChartData = Object.entries(byType).map(([type, value]) => ({
    name: type,
    value,
  }))

  const chartData = view == "asset" ? assetChartData : typeChartData


  return (
    <main className={styles.container}>
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.subtitle}>
          Portfolio Dashboard
        </p>
        <h1 className={styles.title}>
          Asset Allocator
        </h1>
        <p className={styles.value}>
        {total.toFixed(2)} €
        </p>
      </header>

      <section className={styles.card}>

      <div className={styles.toggle}>
        <button onClick={() => setView("asset")}
          className={`${styles.button} ${
            view === "asset" ? styles.active : ""
          }`}
          >By Asset</button>
        <button onClick={() => setView("type")}
          className={`${styles.button} ${
            view === "type" ? styles.active : ""
          }`}
          >By Type</button>
      </div>

      <div className={styles.chartContainer}>
        <AllocationPieChart data= {chartData}/>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{view === "asset" ? "Asset" : "Type"}</th>
            <th>Value (€)</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {view === "asset"
            ? portfolio.assets.map((asset) => (
                <tr key={asset.id} className={styles.row}>
                  <td>{asset.name}</td>
                  <td>{asset.value.toFixed(2)}</td>
                  <td>
                    {total > 0
                      ? ((asset.value / total) * 100).toFixed(2)
                      : "0.00"}
                    %
                  </td>
                </tr>
              ))
            : Object.entries(byType).map(([type, value]) => (
                <tr key={type} className={styles.row}>
                  <td>{type}</td>
                  <td>{value.toFixed(2)}</td>
                  <td>{percentages[type].toFixed(2)}%</td>
                </tr>
              ))}
        </tbody>
      </table>
</section>
    </div>
    </main>
  )
}