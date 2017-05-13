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

export default class extends Component {
    /**
     *  curCoords
     *  @property {string} curCoords.latitude
     *  @property {string} curCoords.longitude
     */
    state = {
        sliderOpen: false,
        curCoords: {},
        isModalShow: false,
        destinationLoc: {}
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
    constructor() {
        super();
        this.handleSliderOpen = this._handleSliderOpen.bind(this);
        this.setCurrentPosition = this._setCurrentPosition.bind(this);
        this.setModalShow = this._setModalShow.bind(this);
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
                        />
                        <Modal isModalShow={this.state.isModalShow} />
                    </div>
                </MuiThemeProvider>
                <Map currentPosition={this.state.curCoords} />
                <Footer />
            </div>
        );
    }
}

