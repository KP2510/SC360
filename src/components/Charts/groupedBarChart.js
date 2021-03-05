import React from 'react';
import { GroupedBar } from '@ant-design/charts';

export default function groupedBarChart(props) {
    const data = [
        {
            label: 'Mon.',
            type: 'series1',
            value: 2800,
        },
        {
            label: 'Mon.',
            type: 'series2',
            value: 2260,
        },
        {
            label: 'Mon.',
            type: 'series3',
            value: 3000,
        },
        {
            label: 'Mon.',
            type: 'series4',
            value: 3260,
        },
    ];
    const config = props.config || {
        title: {
            visible: true,
            text: 'Grouped bar graph',
        },
        data,
        xField: 'value',
        yField: 'label',
        groupField: 'type',
        color: ['#1383ab', '#c52125'],
        label: { formatter: (v) => ` ${v} `.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => ` $ { s } , `) },
    };
    return (
        <div>
            <GroupedBar {...config} />
        </div>
    )
}
