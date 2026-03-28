import { Asset } from "../models/Asset"
import styles from "@/src/app/holdings/holdings.module.css"

type Props = {
    assets: Asset[]
    onDelete: (id: string) => void
    onEdit: (asset: Asset) => void
}

export default function AssetTable({ assets, onDelete, onEdit}: Props) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value (€)</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {assets.map(asset => (
                    <tr key={asset.id} className={styles.row}>
                        <td>{asset.name}</td>
                        <td>{asset.type}</td>
                        <td>{asset.value}</td>
                        <td>
                            <div className={styles.actions}>
                            <button 
                            className={styles.button}
                            onClick={() => onEdit(asset)}>
                                Edit
                            </button>
                            <button 
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={() => onDelete(asset.id)}>
                                Delete
                            </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}