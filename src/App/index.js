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
import Footer from '../Footer';

export default class extends Component {
    state = {
        sliderOpen: false
    };

    _handleSliderOpen(sliderOpen) {
        this.setState({sliderOpen})
    }

    constructor() {
        super();
        this.handleSliderOpen = this._handleSliderOpen.bind(this);
    }

    render() {
        return (
            <div className="wrapper">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <div>
                        <AppBar leftTouchHandle={this.handleSliderOpen}  sliderOpen={this.state.sliderOpen} />
                        <Slider sliderOpen={this.state.sliderOpen} handleSliderOpen={this.handleSliderOpen}/>
                    </div>
                </MuiThemeProvider>
                <Map />
                <Footer />
            </div>
        );
    }
}

