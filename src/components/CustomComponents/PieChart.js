import React from "react";
import * as d3 from "d3";
import { FilterOutlined } from '@ant-design/icons'
import axios from "../../utils/axios-instance"

class Piechart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pieChartData: []
        }
    }

    componentDidMount = () => {
        // axios.get('/charts/pieChart')
        //     .then(res => {
        //         this.setState({ pieChartData: res.data.data }) //{chartData: [{}, {}, ...], chartName: ""}
        //         this.drawPieChart(this.state.pieChartData.chartData)
        //     })
        //     .catch((error) => {
        //         console.log("Error:", error)
        //     })
        this.setState({ pieChartData: dataset}, () => this.drawPieChart(this.state.pieChartData))
    }

    drawPieChart(data) {
        var width = 300;
        var height = 250;

        // a circle chart needs a radius
        var radius = Math.min(width, height) / 2;

        // legend dimensions
        var legendRectSize = 25; // defines the size of the colored squares in legend
        var legendSpacing = 6; // defines spacing between squares

        // define color scale
        var color = d3.scaleOrdinal(d3.schemeBuPu[9])
        //.range(d3.schemeAccent);

        var svg = d3.select(this.refs.pieChart) // select element in the DOM with id 'chart'
            .append('svg') // append an svg element to the element we've selected
            //.attr('width', width) // set the width of the svg element we just added
            //.attr('height', height) // set the height of the svg element we just added
            .attr('viewBox', `-30, -120, ${width * 2}, ${height * 2}`)
            .append('g') // append 'g' element to the svg element
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

        var arc = d3.arc()
            .innerRadius(0) // none for pie chart
            .outerRadius(radius); // size of overall chart

        var pie = d3.pie() // start and end angles of the segments
            .value(function (d) { return d.value; }) // how to extract the numerical data from each entry in our dataset
            .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

        // define tooltip
        var tooltip = d3.select(this.refs.pieChart) // select element in the DOM with id 'chart'
            .append('div') // append a div element to the element we've selected                                    
            .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

        tooltip.append('div') // add divs to the tooltip defined above                            
            .attr('class', 'label'); // add class 'label' on the selection                         

        tooltip.append('div') // add divs to the tooltip defined above                     
            .attr('class', 'count'); // add class 'count' on the selection                  

        tooltip.append('div') // add divs to the tooltip defined above  
            .attr('class', 'percent'); // add class 'percent' on the selection

        // <div id="chart">
        //   <div class="tooltip">
        //     <div class="label">
        //     </div>
        //     <div class="count">
        //     </div>
        //     <div class="percent">
        //     </div>
        //   </div>
        // </div>

        data.forEach(function (d) {
            d.value = +d.value; // calculate count as we iterate through the data
            d.enabled = true; // add enabled property to track which entries are checked
        });

        // creating the chart
        var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
            .data(pie(data)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
            .enter() //creates placeholder nodes for each of the values
            .append('path') // replace placeholders with path elements
            .attr('d', arc) // define d attribute with arc function above
            .attr('fill', function (d) { return color(d.data.name); }) // use color scale to define fill of each label in dataset
            .each(d => { return (this._current - d) }); // creates a smooth animation for each track

        // mouse event handlers are attached to path so they need to come after its definition
        path.on('mouseover', function (d) {  // when mouse enters div      
            d3.sum(data.map(function (d) { // calculate the total number of tickets in the dataset         
                return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
            }));
            //var percent = Math.round(1000 * d.data.value / total) / 10; // calculate percent
            tooltip.select('.label').html(d.data.name); // set current label           
            tooltip.select('.count').html('$' + d.data.value); // set current count            
            //tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
            tooltip.style('display', 'block'); // set display 
            tooltip.style('position', 'absolute');
            tooltip.style('color', '#810f7c');
            tooltip.style('background', '#dcd6dc');
            tooltip.style('border', '1px solid');
            tooltip.style('padding', '4px');
        });

        path.on('mouseout', function () { // when mouse leaves div                        
            tooltip.style('display', 'none'); // hide tooltip for that element
        });

        path.on('mousemove', function (d) { // when mouse moves                
            tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
                .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
        });

        // define legend
        var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
            .data(color.domain()) // refers to an array of labels from our dataset
            .enter() // creates placeholder
            .append('g') // replace placeholders with g elements
            .attr('class', 'legend') // each g is given a legend class
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
                var offset = height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
                var horz = 10 * legendRectSize; // the legend is shifted to the left to make room for the text
                var vert = i * height - offset; // the top of the element is shifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
                return 'translate(' + horz + ',' + vert + ')'; //return translation       
            });

        // adding colored squares to legend
        legend.append('rect') // append rectangle squares to legend                                   
            .attr('width', legendRectSize) // width of rect size is defined above                        
            .attr('height', legendRectSize) // height of rect size is defined above                      
            .style('fill', color) // each fill is passed a color
            .style('stroke', color) // each stroke is passed a color
            .on('click', function (label) {
                var rect = d3.select(this); // this refers to the colored squared just clicked
                var enabled = true; // set enabled true to default
                var totalEnabled = d3.sum(data.map(function (d) { // can't disable all options
                    return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
                }));

                if (rect.attr('class') === 'disabled') { // if class is disabled
                    rect.attr('class', ''); // remove class disabled
                } else { // else
                    if (totalEnabled < 2) return; // if less than two labels are flagged, exit
                    rect.attr('class', 'disabled'); // otherwise flag the square disabled
                    enabled = false; // set enabled to false
                }

                pie.value(function (d) {
                    if (d.name === label) d.enabled = enabled; // if entry label matches legend label
                    return (d.enabled) ? d.value : 0; // update enabled property and return count or 0 based on the entry's status
                });

                path = path.data(pie(data)); // update pie with new data

                path.transition() // transition of redrawn pie
                    .duration(750) // 
                    .attrTween('d', function (d) { // 'd' specifies the d attribute that we'll be animating
                        var interpolate = d3.interpolate(this._current, d); // this = current path element
                        this._current = interpolate(0); // interpolate between current value and the new value of 'd'
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
            });

        // adding text to legend
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) { return d; }); // return label
    }

    render() {
        return (
            this.state.pieChartData !== undefined ?
                (<div>
                    <div ref="pieChart"></div>
                </div>) :
                <div>Loading...</div>
        )
    }

}

const dataset = [
    { name: "H12RTA", value: 152681 },
    { name: "RT12AS", value: 151554 },
    { name: "TW846T", value: 55633 },
    { name: "QT234E", value: 156653 },
    { name: "IIWE32", value: 126364 },
    { name: "PQ12WD", value: 127453 },
    { name: "IU1234", value: 126363 },
    { name: "JY7228", value: 127158 },
    { name: "R2H28A", value: 122264 },
    { name: "TREWL2", value: 153876 },
    { name: "WE5621", value: 141266 },
    { name: "JJHDG2", value: 153758 }
]

export default Piechart