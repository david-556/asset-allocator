"use client"; 

import { useEffect, useState } from "react"
import { loadPortfolio } from "../storage/localStorage";
import { initialPortfolio, PortfolioState } from "../storage/portfolioStore";
import { totalValue, allocationByType, percentageByType } from "../services/portfolioCalculations";
import Link from "next/link"
import AllocationPieChart from "../components/AllocationPieChart";

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
    <div>
      <h1>Asset Allocator</h1>
      <h1>{total.toFixed(2)} €</h1>

      <div>
        <button onClick={() => setView("asset")}>By Asset</button>
        <button onClick={() => setView("type")}>By Type</button>
      </div>

      <AllocationPieChart data= {chartData}/>

      {view == "asset" ? (
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Value (€)</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.value.toFixed(2)}</td>
                <td>{total > 0 ? ((asset.value /total) * 100).toFixed(2) : "0.00"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Value (€)</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(byType).map(([type, value]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{value.toFixed(2)}</td>
                <td>{percentages[type].toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>
        <Link href="/holdings">Go to Holdings</Link>
      </p>
    </div>
  )
}