import React from 'react';
import { GroupedColumn } from '@ant-design/charts';

const GroupedColumnChart = (props) => {
    const data = [
        {
            name: 'London',
            Month: 'Jan.',
            'AverageRainfall': 18.9,
        },
        {
            name: 'London',
            Month: 'Feb.',
            'AverageRainfall': 28.8,
        },
        {
            name: 'London',
            Month: 'Mar.',
            'AverageRainfall': 39.3,
        },
        {
            name: 'London',
            Month: 'Apr.',
            'AverageRainfall': 81.4,
        },
        {
            name: 'London',
            Month: 'May',
            'AverageRainfall': 47,
        },
        {
            name: 'London',
            Month: 'Jun.',
            'AverageRainfall': 20.3,
        },
        {
            name: 'London',
            Month: 'Jul.',
            'AverageRainfall': 24,
        },
        {
            name: 'London',
            Month: 'Aug.',
            'AverageRainfall': 35.6,
        },
        {
            name: 'Berlin',
            Month: 'Jan.',
            'AverageRainfall': 12.4,
        },
        {
            name: 'Berlin',
            Month: 'Feb.',
            'AverageRainfall': 23.2,
        },
        {
            name: 'Berlin',
            Month: 'Mar.',
            'AverageRainfall': 34.5,
        },
        {
            name: 'Berlin',
            Month: 'Apr.',
            'AverageRainfall': 99.7,
        },
        {
            name: 'Berlin',
            Month: 'May',
            'AverageRainfall': 52.6,
        },
        {
            name: 'Berlin',
            Month: 'Jun.',
            'AverageRainfall': 35.5,
        },
        {
            name: 'Berlin',
            Month: 'Jul.',
            'AverageRainfall': 37.4,
        },
        {
            name: 'Berlin',
            Month: 'Aug.',
            'AverageRainfall': 42.4,
        },
        {
            name: 'Germany',
            Month: 'Jan.',
            'AverageRainfall': 12.4,
        },
        {
            name: 'Germany',
            Month: 'Feb.',
            'AverageRainfall': 23.2,
        },
        {
            name: 'Germany',
            Month: 'Mar.',
            'AverageRainfall': 34.5,
        },
        {
            name: 'Germany',
            Month: 'Apr.',
            'AverageRainfall': 99.7,
        },
        {
            name: 'Germany',
            Month: 'May',
            'AverageRainfall': 52.6,
        },
        {
            name: 'Germany',
            Month: 'Jun.',
            'AverageRainfall': 35.5,
        },
        {
            name: 'Germany',
            Month: 'Jul.',
            'AverageRainfall': 37.4,
        },
        {
            name: 'Germany',
            Month: 'Aug.',
            'AverageRainfall': 42.4,
        },
    ];
    const config = {
        title: {
            visible: true,
            text: 'Grouped histogram',
        },
        forceFit: true,
        data,
        xField: 'Month',
        yField: 'AverageRainfall',
        yAxis: { min: 0 },
        label: { visible: true },
        groupField: 'name',
        color: ['#1ca9e6', '#f88c24', '#e74242'],
    };
    return (
        <div>
            <GroupedColumn {...config} />
        </div>
    )
}

export default GroupedColumnChart;
