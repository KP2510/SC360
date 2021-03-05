import React from 'react'
import { Line } from '@ant-design/charts';
import { numberFormatter } from '../../utils/helper';

export default function lineChart(props) {
    const data = [
        {
            date: '2019-01-01',
            value: 3,
        },
        {
            date: '2019-02-01',
            value: 4,
        },
        {
            date: '2019-03-01',
            value: 3.5,
        },
        {
            date: '2019-04-01',
            value: 5,
        },
        {
            date: '2019-05-01',
            value: 4.9,
        },
        {
            date: '2019-06-01',
            value: 6,
        },
        {
            date: '2019-07-01',
            value: 7,
        },
        {
            date: '2019-08-01',
            value: 9,
        },
        {
            date: '2019-09-01',
            value: 3,
        },
        {
            date: '2019-10-01',
            value: 16,
        },
        {
            date: '2019-11-01',
            value: 6,
        },
        {
            date: '2019-12-01',
            value: 8,
        },
    ];
    const config = {
        forceFit: true,
        padding: 'auto',
        data: props.data || data,
        xField: 'date',
        yField: 'value',
        yAxis: {
            nice: true, formatter: (value) => {
                return numberFormatter(value, 2)
            }
        },
        label: { visible: false },
        color: ["#f5cb89"],
        lineSize: 5
    };
    return (
        <div>
            <Line {...config} />
        </div>
    )
}
