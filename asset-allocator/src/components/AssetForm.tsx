"use client"; 

import { useState, type ComponentProps } from "react"
import { Asset } from "@/src/models/Asset"

type Props = {
    onAddAsset: (asset: Asset) => void; 
}

export default function AssetForm({onAddAsset}: Props) {
    const[name, setName] = useState("")
    const[type, setType] = useState<Asset["type"]>("ETF")
    const[value, setValue] = useState("")

    const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
        e.preventDefault()

        if(!name.trim() || !value ) return

        const newAsset: Asset = {
            id: crypto.randomUUID(),
            name: name.trim(),
            type,
            value: Number(value)
        };

        onAddAsset(newAsset)

        setName("")
        setType("ETF")
        setValue("")

    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as Asset["type"])}>
                    <option value="ETF">ETF</option>
                    <option value="Stock">Stock</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div>
                <label>Value</label>
                <input 
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <button type="submit">Add Asset</button>
        </form>
    )
}