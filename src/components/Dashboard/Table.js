import React, { Component } from 'react';
import { ReactTabulator } from 'react-tabulator';

export default class Table extends Component {
    state = {
        columnDefs: [],
        rowData: []
    }
    componentDidMount() {
        const { columns, data } = this.props.tableData;
        const columnDefs = columns.map(column => (
            {
                title: column.displayName,
                field: column.field,
                frozen: this.props.freezedColumns && this.props.freezedColumns.indexOf(column.field) > -1
            }
        ))
        this.setState({
            rowData: data,
            columnDefs
        })
    }

    setTableReference = (reference) => {
        if (reference && reference.table) {
            this.table = reference.table
        }
    }
    render() {
        return (
            <React.Fragment>
                {
                    this.state.rowData.length && <ReactTabulator
                        options={{
                            pagination: 'local',
                            paginationSize: 16,
                            paginationButtonCount: 5,
                            maxHeight: '80%',
                            movableColumns: true,
                            columnMinWidth: 150
                        }}
                        ref={ref => { this.setTableReference(ref) }}
                        columns={this.state.columnDefs}
                        data={this.state.rowData}
                        tooltips={true} />
                }
            </React.Fragment>
        )
    }
}
