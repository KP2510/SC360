import React from 'react'
import { StackedBar } from '@ant-design/charts';

export default function stackedBarChart(props) {
    const data = [
        {
            year: '2006',
            type: 'redDeliciou',
            value: 10,
        },
        {
            year: '2006',
            type: 'mcintosh',
            value: 15,
        },
        {
            year: '2006',
            type: 'oranges',
            value: 9,
        },
        {
            year: '2006',
            type: 'pears',
            value: 6,
        },
        {
            year: '2007',
            type: 'redDeliciou',
            value: 12,
        },
        {
            year: '2007',
            type: 'mcintosh',
            value: 18,
        },
        {
            year: '2007',
            type: 'oranges',
            value: 9,
        },
        {
            year: '2007',
            type: 'pears',
            value: 4,
        },
        {
            year: '2008',
            type: 'redDeliciou',
            value: 5,
        },
        {
            year: '2008',
            type: 'mcintosh',
            value: 20,
        },
        {
            year: '2008',
            type: 'oranges',
            value: 8,
        },
        {
            year: '2008',
            type: 'pears',
            value: 2,
        },
        {
            year: '2009',
            type: 'redDeliciou',
            value: 1,
        },
        {
            year: '2009',
            type: 'mcintosh',
            value: 15,
        },
        {
            year: '2009',
            type: 'oranges',
            value: 5,
        },
        {
            year: '2009',
            type: 'pears',
            value: 4,
        },
        {
            year: '2010',
            type: 'redDeliciou',
            value: 2,
        },
        {
            year: '2010',
            type: 'mcintosh',
            value: 10,
        },
        {
            year: '2010',
            type: 'oranges',
            value: 4,
        },
        {
            year: '2010',
            type: 'pears',
            value: 2,
        },
        {
            year: '2011',
            type: 'redDeliciou',
            value: 3,
        },
        {
            year: '2011',
            type: 'mcintosh',
            value: 12,
        },
        {
            year: '2011',
            type: 'oranges',
            value: 6,
        },
        {
            year: '2011',
            type: 'pears',
            value: 3,
        },
        {
            year: '2012',
            type: 'redDeliciou',
            value: 4,
        },
        {
            year: '2012',
            type: 'mcintosh',
            value: 15,
        },
        {
            year: '2012',
            type: 'oranges',
            value: 8,
        },
        {
            year: '2012',
            type: 'pears',
            value: 1,
        },
        {
            year: '2013',
            type: 'redDeliciou',
            value: 6,
        },
        {
            year: '2013',
            type: 'mcintosh',
            value: 11,
        },
        {
            year: '2013',
            type: 'oranges',
            value: 9,
        },
        {
            year: '2013',
            type: 'pears',
            value: 4,
        },
        {
            year: '2014',
            type: 'redDeliciou',
            value: 10,
        },
        {
            year: '2014',
            type: 'mcintosh',
            value: 13,
        },
        {
            year: '2014',
            type: 'oranges',
            value: 9,
        },
        {
            year: '2014',
            type: 'pears',
            value: 5,
        },
    ];
    const config = props.config || {
        forceFit: true,
        data,
        yField: 'year',
        xField: 'value',
        stackField: 'type',
        label: {
            offset: 0,
            visible: true,
            position: 'middle',
            // formatter: (v) => Math.round(v / 10000),
        },
    };
    return (
        <div>
            <StackedBar {...config} />
        </div>
    )
}
