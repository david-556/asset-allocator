"use client";

import { useEffect, useState } from "react"
import AssetTable from "@/src/components/AssetTable"
import AssetForm from "@/src/components/AssetForm"
import {Asset} from "@/src/models/Asset"
import {loadPortfolio, savePortfolio} from "@/src/storage/localStorage"
import {addAsset, initialPortfolio, PortfolioState, deleteAsset} from "@/src/storage/portfolioStore"

export default function HoldingsPage() {

    const[portfolio, setPortfolio] = useState<PortfolioState>(initialPortfolio)

    useEffect(() => {
        setPortfolio(loadPortfolio())
    }, [])

    function handleAddAsset(asset: Asset) {
        const updated = addAsset(portfolio, asset)
        setPortfolio(updated)
        savePortfolio(updated)
    }

    function handleDelete(id: string) {
        const updated = deleteAsset(portfolio, id)
        setPortfolio(updated)
        savePortfolio(updated)
    }


    return (
        <div>
            <h1>Holdings Page</h1>

            <AssetForm onAddAsset={handleAddAsset}/>
            <AssetTable assets={portfolio.assets} onDelete={handleDelete}/>
        </div>

    )
  }