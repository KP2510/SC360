import React, { Component } from 'react'
import * as d3 from 'd3'
import axios from "../../utils/axios-instance"
//import { FilterOutlined } from '@ant-design/icons'

class LineChart extends Component {
    // constructor(props) {
    //     super(props)
    //     // this.state = {
    //     //     barChartData: [],
    //     //     barChartName: ""
    //     // }
    // }
    componentDidMount() {
        this.drawLineChart(this.props.dataSet)
        // axios.get('/charts/barChart')
        //     .then(res => {
        //         console.log("Res In Bar::", res)
        //         this.setState({
        //             barChartData: res.data.data.chartData,
        //             barChartName: res.data.data.chartName
        //         })
        //         // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) { console.log('data:', data) })
        //         //console.log("barChartData", this.state.barChartData)
        //         //console.log("barChartName", this.state.barChartName)
        //         this.drawLineChart(dataSet)

        //     })
        //     .catch((error) => {
        //         console.log("Error:", error)
        //     })
    }
    drawLineChart(data) {
        //console.log("data::", this.props)

        // set the dimensions and margins of the graph
        var margin = { top: 60, right: 200, bottom: 60, left: 60 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(this.refs.lineChart)
            .append("svg")
            .attr('viewBox', `0, 0, ${width + margin.left + margin.right}, ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // define tooltip
        var tooltip = d3.select(this.refs.lineChart) // select element in the DOM with id 'chart'
            .append('div') // append a div element to the element we've selected                                    
            .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

        tooltip.append('div') // add divs to the tooltip defined above                            
            .attr('class', 'label'); // add class 'label' on the selection                         

        tooltip.append('div') // add divs to the tooltip defined above                     
            .attr('class', 'count'); // add class 'count' on the selection                  

        tooltip.append('div') // add divs to the tooltip defined above  
            .attr('class', 'percent'); // add class 'percent' on the selection
        // group the data: I want to draw one line per group

        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.type; })
            .entries(data);
        //console.log("sumstat::", sumstat)

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return new Date(d.date); }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b %Y"))
            )
            .selectAll("text")
            //.attr("transform", "translate(-25,20)rotate(-45)");


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return + d.qty; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette
        var res = sumstat.map(function (d) { return d.key }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            // .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])
            .range(['rgb(242,186,99)', 'rgb(114,99,134)'])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("stroke-width", 5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(new Date(d.date)); })
                    .y(function (d) { return y(+d.qty); })
                    (d.values)
            })
            .on('mouseover', function (d) {
                //console.log("d",d)
                const showData = d.values.map((i, key) => {
                    return (`<div key= ${key} > <span>Qty: ${parseInt(i.qty)}</span><span>  Date: ${i.date}</span></div>`)
                }).join("")
                tooltip.select('.label').html(d.key); // set current label           
                tooltip.select('.count').html(showData); // set current count                    
                tooltip.style('display', 'block'); // set display 
                tooltip.style('position', 'absolute');
                tooltip.style('width', 'auto');
                tooltip.style('color', 'steelblue');
                tooltip.style('background', '#dcd6dc');
                tooltip.style('border', '1px solid');
                tooltip.style('padding', '4px');

            }).on('mousemove', function (d) { // when mouse moves      
                console.log('(d3.event.layerY', d3.event.layerY)
                console.log('d3.event.layerX', d3.event.layerX)
                tooltip.style('top', (d3.event.layerY + 150) + 'px') // always 10px below the cursor
                    .style('left', (d3.event.layerX + 30) + 'px'); // always 10px to the right of the mouse
            }).on('mouseout', function () {
                tooltip.style('display', 'none');
            });

        //Create legend
        var legend = svg.selectAll(".legend").data(color.domain().slice()).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
            return `translate( 0 , ${i * 30})`;
        });


        legend.append("rect")
            .attr("x", width + 50)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color);

        legend.append("text")
            .attr("x", width + 70)
            .attr("y", 8)
            .style("text-anchor", "start")
            .style("font-size", "10px")
            .text(function (d) {
                return d;
            });


    }

    render() {
        return (
            <div>
                {/* <FilterOutlined style={{ float: "right", fontSize: 20, margin: '0px 20px 0px 0px' }} /> */}
                {/* <div style={{ margin: '2% 0% 0% 25%', fontWeight: 700, width: 'fit-content' }}>ProductBase vs SKU Shortages</div> */}
                <div ref="lineChart"></div>
            </div>
        )
    }
}
export default LineChart