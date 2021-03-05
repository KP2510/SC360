import React, { Component } from 'react';
import { connect } from 'react-redux'

//import axios from '../../utils/axios-instance';
import { actionType } from '../../shared/actionType'

import FavouriteCard from './FavouriteCard';
import GenericCard from './GenericCard';
// import AddCard from './AddCard'
// import EditCard from './EditCard';
// import SaveCard from './SaveCard';
import Slider from "react-slick";
import BeatLoader from "react-spinners/BeatLoader"
import { Typography } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './OperationalStatus.css';
import { getValidRoles } from '../../utils/helper';

class OperationalStatus extends Component {

    componentDidMount() {
        this.props.dispatch({ type: actionType.OPERATIONAL_STATUS_REQUEST })
    }

    render() {
        const settings = {
            //dots: true,
            // appendDots: dots => (
            //     <div
            //         style={{
            //             backgroundColor: "#ddd",
            //             borderRadius: "10px",
            //             padding: "10px"
            //         }}
            //     >
            //         <ul style={{ margin: "0px" }}> {dots} </ul>
            //     </div>
            // ),
            // customPaging: i => (
            //     <div
            //         style={{
            //             width: "30px",
            //             color: "blue",
            //             border: "1px blue solid"
            //         }}
            //     >
            //         {i + 1}
            //     </div>
            // ),
            infinite: false,
            speed: 500,
            slidesToShow: 6,
            slidesToScroll: 1,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: false,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        const { isPlanner } = getValidRoles(this.props.userInfo);

        return (
            <div className="operational-status" >
                <Slider {...settings}>
                    {this.props.operationalStatus.kpiData && this.props.operationalStatus.kpiData.lenght !== 0 ?
                        (this.props.operationalStatus.kpiData.map((kpi, index) => (
                            <div key={index}>
                                {kpi.favourite ? <FavouriteCard kpiData={kpi} /> : <GenericCard kpiData={kpi} />}
                            </div>
                        ))) : (<BeatLoader
                            size={30}
                            color={"#ff8f1a"}
                            loading={true}
                        />)
                    }
                </Slider>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.login.userInfo, operationalStatus: state.operationalStatus };
}

export default connect(mapStateToProps)(OperationalStatus);