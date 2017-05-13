/**
 * Created by taotanming on 2017/5/10.
 */

import React, {Component} from 'react';
import './index.scss';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

//function plugins
import fetchJsonp from 'fetch-jsonp';
class Slider extends Component {
    _getCurrentPosition() {
        const {setCurrentPosition, setModalShow} = this.props;
        setModalShow(true);
        const getNavigatorSuccess = (pos) => {
            const crd = pos.coords;
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`More or less ${crd.accuracy} meters.`);
            const obj = {};
            obj.latitude = crd.latitude.toFixed(6);
            obj.longitude = crd.longitude.toFixed(6);
            setCurrentPosition(obj);
            setModalShow(false);
        };

        const getNavigatorError = (err) => {
            // alert(`ERROR(${err.code}): ${err.message}`);
            console.error(`ERROR(${err.code}): ${err.message}`);
            setCurrentPosition({err});
            setModalShow(false);
        };
        navigator.geolocation.getCurrentPosition(getNavigatorSuccess, getNavigatorError, this.options);
        // fetchJsonp('http://ipinfo.io')
        //     .then(function(response) {
        //         return response.json();
        //     }).then((data) => {
        //         const loc = data.loc;
        //         const locArr = loc.match(/(^.+),(.+)/);
        //         getNavigatorSuccess(locArr[1], locArr[2])
        //         console.log(locArr);
        //     }).catch(function(ex) {
        //     getNavigatorError(ex);
        // });
    }
    _setDestination() {
        const {destinationLoc} = this.props;

    }
    constructor() {
        super();
        this.options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };
        this.getCurrentPosition = this._getCurrentPosition.bind(this);
        this.setDestination = this._setDestination.bind(this);
    }
    componentWillMount() {
        this.getCurrentPosition();
    }
    render() {
        const {sliderOpen, handleSliderOpen, curCoords} = this.props;
        return (
            <div>
                <Drawer
                    docked={false}
                    width={400}
                    open={sliderOpen}
                    onRequestChange={(open) => handleSliderOpen(open)}
                >
                    <ListItem primaryText="导航信息"/>
                    <ListItem primaryText="当前位置"
                              secondaryText={`纬度为${curCoords.latitude}, 经度为${curCoords.longitude}`}
                              rightIconButton={ <IconButton
                                  iconClassName="iconfont icon-dingwei"
                                  onTouchTap={this.getCurrentPosition}
                              />}
                    />
                    <ListItem>
                        <TextField
                            hintText="目标位置经度"
                            ref={(input) => {this.desLon = input}}
                        />
                        <TextField
                            hintText="目标位置纬度"
                            ref={(input) => {this.desLat = input}}
                        />
                    </ListItem>
                    <FlatButton
                        label="开始导航"
                        style={{float: 'right'}}
                        onTouchTap={this.setDestination}
                    />
                </Drawer>
            </div>
        )
    }
};
export default Slider;
