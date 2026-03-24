import { Asset } from "../models/Asset"

type Props = {
    assets: Asset[]
    onDelete: (id: string) => void
}

export default function AssetTable({ assets, onDelete}: Props) {
    return (
        <table>
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
                    <tr key={asset.id}>
                        <td>{asset.name}</td>
                        <td>{asset.type}</td>
                        <td>{asset.value}</td>
                        <td>
                            <button onClick={() => onDelete(asset.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}