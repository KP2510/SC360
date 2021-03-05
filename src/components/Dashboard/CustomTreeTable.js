import React from 'react';
import { ReactTabulator } from 'react-tabulator';
import { Input, Select, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// import "tabulator-tables/dist/css/materialize/tabulator_materialize.min.css"

const { Search } = Input;
const Option = Select.Option;

const CustomTreeTable = (props) => {

    const getColumnDefn = (region, dataType) => {
        if (dataType === 'column') {
            const columns = [
                { title: `FORECAST - ${region}`, field: "forecast", widthGrow: 2, frozen: true },
                { title: "Details", field: "details", frozen: true },
                { title: "Jan", field: "jan" },
                { title: "Feb", field: "feb" },
                { title: "March", field: "mar" },
                { title: "April", field: "apr" },
                { title: "May", field: "may" },
                { title: "June", field: "jun" },
                { title: "July", field: "jul" },
                { title: "Aug", field: "aug" },
                { title: "Sep", field: "sep" },
                { title: "Oct", field: "oct" },
                { title: "Nov", field: "nov" },
                { title: "Dec", field: "dec" },
                { title: "Total", field: "total" }
            ];
            return columns;
        } else {
            const tableDataNested = [
                {
                    forecast: `${region} Orders`, details: "JYH112", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200',
                    _children: [
                        { forecast: "Order 1", details: "JYH112", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Order 2", details: "JYH112", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Order 3", details: "JYH112", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Order 4", details: "JYH112", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' }
                    ]
                },
                {
                    forecast: `${region} Deals`, details: "TRW452", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200',
                    _children: [
                        { forecast: "Deal 1", details: "TRW452", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Deal 2", details: "TRW452", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Deal 3", details: "TRW452", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                        { forecast: "Deal 4", details: "TRW452", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' }
                    ]
                },
                { forecast: `${region} DEMAND TOTAL`, details: "FKUY35", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                { forecast: `${region} FORECAST`, details: "FKER34", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
                { forecast: "DIFFERENCE", details: "ERWY51", jan: "200", feb: "200", mar: "200", apr: "200", may: "200", jun: "200", jul: "200", aug: "200", sep: "200", oct: "200", nov: "200", dec: "200", total: '200' },
            ]
            return tableDataNested;
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Tooltip placement="topLeft" title="Table Settings">
                    <SettingOutlined style={{margin: '0px 0px 0px 10px'}}/>
                </Tooltip>
                <Select
                    style={{ width: '230px' }}
                    placeholder="Standard"
                >
                    <Option value="Standard">Standard</Option>
                </Select>
                <Search
                    placeholder="search"
                    style={{ width: 300, marginRight: 10 }} />
            </div>
            {
                ['EMEA', 'APJ', 'AMS', 'GENERAL'].map(region => (
                    <ReactTabulator
                        key={region}
                        style={{ width: '100%', marginBottom: 25 }}
                        options={{
                            //pagination: 'local', paginationSize: 6, paginationButtonCount: 5, 
                            dataTree: true, layout: 'fitColumns'
                        }}
                        ref={ref => {
                            console.log(ref)
                        }}
                        data={getColumnDefn(region, 'data')}
                        tooltips={true}
                        columns={getColumnDefn(region, 'column')}
                    />
                ))
            }
        </div >
    )
}

export default CustomTreeTable;