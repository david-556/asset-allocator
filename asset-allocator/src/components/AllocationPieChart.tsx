"use client"; 

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"; 
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

type ChartItem = {
    name: string
    value: number 
}

type Props = {
    data: ChartItem[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f"]

export default function AllocationPieChart({data}: Props) {
    return (
        <div style={{width: "100%", height: 300}}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({name,percent}) => 
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        >
                            {data.map((entry, index) => (
                                <Cell key = {entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value?: ValueType, _name?: NameType) => {
                                if (value == null) return "—"
                                const num = typeof value === "number" ? value : Number(value)
                                return Number.isFinite(num) ? `${num.toFixed(2)} €` : "—"
                            }}
                        />
                        <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}