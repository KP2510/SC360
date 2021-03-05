import React from 'react'
import { StackedColumn } from '@ant-design/charts';

export default function stackedColumnChart() {
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
    const config = {
        forceFit: true,
        title: {
            visible: false,
            text: 'Unicom regional component interaction',
        },
        description: {
            visible: false,
            text:
                'The Unicom area component can be triggered through interaction\u3002 through the triggerOn configuration item to set the trigger event of the Unicom area component\u3002 only display the Unicom area of ​​one stacked field at a time\u3002',
        },
        padding: 'auto',
        data,
        xField: 'year',
        yField: 'value',
        yAxis: { min: 0 },
        label: { visible: false },
        stackField: 'type',
        Color: ['# ae331b', '# f27957', '#dadada', '# 609db7', '# 1a6179'],
        connectedArea: {
            visible: true,
            triggerOn: 'mouseenter',
        },
    };
    return (
        <div>
            <StackedColumn {...config} />
        </div>
    )
}
