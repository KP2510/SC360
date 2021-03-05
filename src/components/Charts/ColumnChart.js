import React from 'react';
import { Column } from '@ant-design/charts';
import { numberFormatter } from '../../utils/helper';

export default function ColumnChart(props) {
    const data = [
        {
            type: 'furniture appliances',
            sales: 38,
        },
        {
            type: 'Grain, oil and non-staple food',
            sales: 52,
        },
        {
            type: 'Fresh fruit',
            sales: 61,
        },
        {
            type: 'Beauty Care',
            sales: 145,
        },
        {
            type: 'Mother and baby supplies',
            sales: 48,
        },
        {
            type: 'Imported Food',
            sales: 38,
        },
        {
            type: 'Food and Beverage',
            sales: 38,
        },
        {
            type: 'Household cleaning',
            sales: 38,
        },
    ];
    const config = {
        forceFit: true,
        data: props.data || data,
        padding: 'auto',
        xField: props.xAxis || 'type',
        yField: props.yAxis || 'sales',
        yAxis: {
            label: {
                formatter: (value) => {
                    return numberFormatter(value, 2)
                }
            },
            title: { visible: false }
        },
        xAxis: {
            label: {
                autoRotate: false,
                formatter: (value, a, b) => {
                    const values = value.split(' ');
                    return `${values[0]}\n${values[1]}`;
                }
            },
            title: { visible: false }
        }
    };
    return (
        <div>
            <Column {...config} />
        </div>
    )
}
