"use client";

import { useEffect, useState } from "react"
import AssetTable from "@/src/components/AssetTable"
import AssetForm from "@/src/components/AssetForm"
import {Asset} from "@/src/models/Asset"
import {loadPortfolio, savePortfolio} from "@/src/storage/localStorage"
import {addAsset, PortfolioState, deleteAsset, updateAsset} from "@/src/storage/portfolioStore"

export default function HoldingsPage() {

    const[portfolio, setPortfolio] = useState<PortfolioState>(loadPortfolio())
    const[editingAsset, setEditingAsset] = useState<Asset | null>(null)

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

        if(editingAsset?.id == id) {
            setEditingAsset(null)
        }
    }

    function handleStartEdit(asset: Asset) {
        setEditingAsset(asset)
    }

    function handleUpdateAsset(asset: Asset) {
        const updated = updateAsset(portfolio, asset)
        setPortfolio(updated)
        savePortfolio(updated)
        setEditingAsset(null)
    }


    return (
        <div>
            <h1>Holdings</h1>

            <AssetForm 
                onAddAsset={handleAddAsset}
                onUpdateAsset={handleUpdateAsset}
                initialAsset={editingAsset}
            />
            <AssetTable 
                assets={portfolio.assets} 
                onDelete={handleDelete}
                onEdit={handleStartEdit}
            />
        </div>

    )
  }