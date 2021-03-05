import React from 'react'
import { Donut } from '@ant-design/charts';
import { propsToOptions } from 'react-tabulator/lib/ConfigUtils';

export default function donutChart(props) {
    const data = [
        {
            type: 'Classification One',
            value: 27,
        },
        {
            type: 'Classification Two',
            value: 25,
        },
        {
            type: 'Classification Three',
            value: 18,
        },
        {
            type: 'Classification Four',
            value: 15,
        },
        {
            type: 'Classification Five',
            value: 10,
        },
        {
            type: 'Other',
            value: 5,
        },
    ];
    const config = {
        forceFit: true,
        title: {
            visible: false,
            text: 'ring graph',
        },
        description: {
            visible: false,
            text: 'The outer radius of the ring graph determines the size of the ring graph and the inner radius determines the thickness of the ring graph',
        },
        radius: 0.8,
        padding: 'auto',
        data: props.data || data,
        angleField: 'value',
        colorField: 'type',
        statistic: {
            totalLabel: 'Total',
        },
        label: { visible: false },
        legend: {
            visible: true,
            position: "bottom-center"
        },
    };
    return (
        <div
            //style={{ maxWidth: 600 }}
        >
            <Donut {...config} />
        </div>
    )
}
