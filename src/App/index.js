/**
 * Created by taotanming on 17/4/20.
 */

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './index.scss';
//import
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
//import Component
import Map from '../Map';
import AppBar from '../AppBar';
import Slider from '../Slider';
import Modal from '../Modal';
import Footer from '../Footer';
import Dialog from '../Dialog';

export default class extends Component {
    /**
     *  curCoords
     *  @property {string} curCoords.latitude
     *  @property {string} curCoords.longitude
     */
    state = {
        sliderOpen: false,
        isModalShow: false,
        isDialogShow: false,
        isBeginLeader: false,
        dialogType: 'input',
        trajectories: [],
        testTrajectory: {
            status: false,
            type: '',
            id: 0,
            points: [],
            func: ''
        },
        examinationResult: {

        },
        curCoords: {},
        destinationLoc: {},
        destinationRoute: {}
    };

    _handleSliderOpen(sliderOpen) {
        this.setState({sliderOpen})
    }
    _setCurrentPosition(crd) {
        this.setState({curCoords: crd});
    }
    _setModalShow(isShow) {
        this.setState({isModalShow: isShow});
    }
    _setModalType(type) {
        this.setState({dialogType: type});
    }
    _setTrajectories(trajectories) {
        this.setState({trajectories});
    }
    _setDialogShow(isShow) {
        this.setState({isDialogShow: isShow});
    }
    _setExaminationResult(examinationResult) {
        const res = Object.assign({}, this.state.examinationResult, examinationResult);
        this.setState({examinationResult: res});
    }
    _setDestinationRoute(destinationRoute) {
        this.setState({destinationRoute, isBeginLeader: true})
    }
    _overLeader() {
        this.setState({isBeginLeader: false});
    }
    //test handle
    _setTestStatus(testTrajectory) {
        this.setState({testTrajectory});
    }
    constructor() {
        super();
        this.handleSliderOpen = this._handleSliderOpen.bind(this);
        this.setCurrentPosition = this._setCurrentPosition.bind(this);
        this.setModalShow = this._setModalShow.bind(this);
        this.setDestinationRoute = this._setDestinationRoute.bind(this);
        this.overLeader = this._overLeader.bind(this);
        this.setTestStatus = this._setTestStatus.bind(this);
        this.setDialogShow = this._setDialogShow.bind(this);
        this.setModalType = this._setModalType.bind(this);
        this.setTrajectories = this._setTrajectories.bind(this);
        this.setExaminationResult = this._setExaminationResult.bind(this);
    }
    componentDidMount() {
        fetch('/test/test', {
            method: 'GET'
        }).then((res) => {
            return res.text();
        }).then((data) =>{
            console.log(data);
        })
    }
    render() {
        return (
            <div className="wrapper">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <div>
                        <AppBar leftTouchHandle={this.handleSliderOpen}  sliderOpen={this.state.sliderOpen} />
                        <Slider
                            sliderOpen={this.state.sliderOpen}
                            handleSliderOpen={this.handleSliderOpen}
                            setCurrentPosition={this.setCurrentPosition}
                            curCoords={this.state.curCoords}
                            setModalShow={this.setModalShow}
                            destinationLoc={this.state.destinationLoc}
                            setDestinationRoute={this.setDestinationRoute}
                            overLeader={this.overLeader}
                            setTestStatus={this.setTestStatus}
                            setDialogShow = {this.setDialogShow}
                            setModalType={this.setModalType}
                            trajectories={this.state.trajectories}
                            setTrajectories={this.setTrajectories}
                        />
                        <Modal isModalShow={this.state.isModalShow} />
                        <Dialog
                            isDialogShow = {this.state.isDialogShow}
                            setDialogShow = {this.setDialogShow}
                            dialogType={this.state.dialogType}
                            trajectories={this.state.trajectories}
                            setTrajectories={this.setTrajectories}
                            setExaminationResult={this.setExaminationResult}
                        />
                    </div>
                </MuiThemeProvider>
                <Map
                    currentPosition={this.state.curCoords}
                    destinationRoute={this.state.destinationRoute}
                    testTrajectory={this.state.testTrajectory}
                    setTestStatus={this.setTestStatus}
                    examinationResult={this.state.examinationResult}
                />
                <Footer />
            </div>
        );
    }
}

