import React from 'react';
import StepLineChart from './stepLineChart';
import LineBarChart from './lineBarChart';
import DonutChart from './donutChart';
import StackedColumnChart from './stackedColumnChart';
import LineChart from './lineChart';
import GroupedColumnChart from './groupedColumnChart';
import StackedColumnLineChart from './stackedColumnLine';
import GroupedBarChart from './groupedBarChart';
import StackedBarChart from './stackedBarChart';

export default function charts() {
    return (
        <div>
            <StepLineChart></StepLineChart>
            <LineBarChart></LineBarChart>
            <DonutChart></DonutChart>
            <StackedColumnChart></StackedColumnChart>
            <LineChart></LineChart>
            <GroupedColumnChart></GroupedColumnChart>
            <StackedColumnLineChart></StackedColumnLineChart>
            <GroupedBarChart></GroupedBarChart>
            <StackedBarChart></StackedBarChart>
        </div>
    )
}
