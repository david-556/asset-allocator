"use client"; 

import { useEffect, useState, type ComponentProps } from "react"
import { Asset } from "@/src/models/Asset"
import styles from "@/src/app/holdings/holdings.module.css"

type Props = {
    onAddAsset?: (asset: Asset) => void;
    onUpdateAsset?: (asset: Asset) => void
    initialAsset?: Asset | null
}

export default function AssetForm({
    onAddAsset,
    onUpdateAsset,
    initialAsset = null,
}: Props) {
    const[name, setName] = useState("")
    const[type, setType] = useState<Asset["type"]>("ETF")
    const[value, setValue] = useState("")

    useEffect(() => {
        if(initialAsset) {
            setName(initialAsset.name)
            setType(initialAsset.type)
            setValue(String(initialAsset.value));
        } else {
            setName("")
            setType("ETF")
            setValue("")
        }
    }, [initialAsset]);

    const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
        e.preventDefault()

        if(!name.trim() || !value ) return

        const newAsset: Asset = {
            id: initialAsset ? initialAsset.id: crypto.randomUUID(),
            name: name.trim(),
            type,
            value: Number(value)
        };

        if(initialAsset) {
            onUpdateAsset?.(newAsset)
        } else {
            onAddAsset?.(newAsset)
        }

        if(!initialAsset) {
            setName("")
            setType("ETF")
            setValue("")
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                    className={styles.input}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select className={styles.select}
                        value={type} 
                        onChange={(e) => setType(e.target.value as Asset["type"])}>
                    <option value="ETF">ETF</option>
                    <option value="Stock">Stock</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Value</label>
                <input 
                    className={styles.input}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            <button type="submit" className={styles.submitButton}>{initialAsset ? "Update Asset" : "Add Asset"}</button>
        </form>
    )
}