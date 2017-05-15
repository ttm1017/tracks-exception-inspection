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
//helper func
import {transformPositionData} from '../utils/dataTransform';
//function plugins
// import fetchJsonp from 'fetch-jsonp';
// import data
import data from '../../data/outlier';

console.log('===');
console.log(data);
class Slider extends Component {
    state = {
        desLon: 0,
        desLat: 0
    };

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
        const {setDestinationRoute} = this.props;
        fetch(`/currentPosition?desLon=${this.state.desLon}&desLat=${this.state.desLat}`)
            .then((res) => {
                if (!res.ok) {
                    throw 'Network is not well'
                }
                return res.json()
            })
            .then((data) => {
                console.log(data);
                if (data.status == null) {
                    if(window.WebSocket != undefined) {
                        this.connection = new WebSocket('ws://localhost:8001');
                        setDestinationRoute(data);
                        //open event
                        this.connection.onopen =  (event) => {
                            console.log('Connected to: ' + event);
                            this.connection.send(JSON.stringify({
                                status: 'start'
                            }));
                        };
                        //close event
                        this.connection.onclose = function () {
                            console.log('Close the Websocket');
                        };
                        //error handle
                        this.connection.onerror = function (event) {
                            console.log("Error: " + event.data);
                        };
                        //receive the Message
                        /**
                         * event.data
                         * @property {string} event.data.type
                         * @property {Array} event.data.outline
                         * @property {stirng} event.data.errorInfo
                         */
                        this.connection.onmessage = function (event) {
                            if (event.data.type === 'error') {
                                alert(event.data.errorInfo);
                            }
                            if (event.data.type === 'outline') {
                                const outline = event.data.outline;
                            }
                        };
                    }
                    else {
                        alert('You must use Browser with Websoctet function.like: Chrome');
                    }
                }
            });
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
        const {sliderOpen, handleSliderOpen, curCoords, overLeader, setCurrentPosition, setTestStatus} = this.props;
        const self = this;
        const testValueRange = function (L, testTrajectory) {
            const outlineTraj = transformPositionData(testTrajectory.points);
            //render the leaflet map

            //test
            const testStart = outlineTraj[0];
            this.map.setView(testStart, 10);
            const circle = L.circleMarker(testStart, {radius: 3,color: 'red',}).addTo(this.map);

            //main content
            let renderPoints = [];
            const outLength = outlineTraj.length;

            const route = () => {
                // renderPoints = renderPoints.concat(outlineTraj.slice(count,count + outLength/8));
                const point = outlineTraj.shift();
                if (point[0] >= 90) {
                    clearInterval(this.nInterId);
                    alert('the position value is wrong');
                    return;
                }
                renderPoints.push(point);
                console.log(point);
                circle.setLatLng(point);
                if (renderPoints.length >= outLength) {
                    //finish outline render
                    clearInterval(this.nInterId);
                    setTestStatus({status: false});
                }
            };
            if (this.nInterId == null) {
                this.nInterId = window.setInterval(route, 1000);
            }
        };
        const testAngle = function(L, testTrajectory) {
            //get outline all data
            const outlineTraj = transformPositionData(testTrajectory.points);

            if (self.connection) {

                const sendPoint = () => {
                    // renderPoints = renderPoints.concat(outlineTraj.slice(count,count + outLength/8));
                    const point = outlineTraj.shift();
                    console.log(point);
                    circle.setLatLng(point);

                    //send message
                    const msg = {
                        status: 'leading',
                        point
                    };
                    self.connection.send(JSON.stringify(msg));

                    if (outlineTraj.length === 0) {
                        //finish outline render
                        self.connection.send(JSON.stringify({
                            status: 'overLead'
                        }));
                        self.connection.close();
                        clearInterval(this.nInterId);
                    }
                };
                if (this.nInterId == null) {
                    this.nInterId = window.setInterval(sendPoint, 1000);
                }
            }
        };
        const testSignalExist = function (L, testTrajectory) {
            //get outline all data
            const outlineTraj = transformPositionData(testTrajectory.points);
            const outlineTrajLength = outlineTraj.length;
            if (self.connection) {

                const sendPoint = () => {
                    // renderPoints = renderPoints.concat(outlineTraj.slice(count,count + outLength/8));
                    const point = outlineTraj.shift();
                    console.log(point);
                    circle.setLatLng(point);

                    //send message
                    const msg = {
                        status: 'leading',
                        point
                    };
                    self.connection.send(JSON.stringify(msg));

                    if (outlineTraj.length === outlineTrajLength - 5) {
                        //finish outline render
                        self.connection.send(JSON.stringify({
                            status: 'overLead'
                        }));
                        self.connection.send(JSON.stringify(msg));

                        clearInterval(this.nInterId);
                    }
                };
                if (this.nInterId == null) {
                    this.nInterId = window.setInterval(sendPoint, 1000);
                }
            }
        };
        const testSignalDisappear = function (L, testTrajectory) {
            //get outline all data
            const outlineTraj = transformPositionData(testTrajectory.points);
            const outlineTrajLength = outlineTraj.length;
            if (self.connection) {

                const sendPoint = () => {
                    // renderPoints = renderPoints.concat(outlineTraj.slice(count,count + outLength/8));
                    const point = outlineTraj.shift();
                    console.log(point);
                    circle.setLatLng(point);

                    //send message
                    const msg = {
                        status: 'leading',
                        point
                    };
                    self.connection.send(JSON.stringify(msg));

                    if (outlineTraj.length === outlineTrajLength - 5) {
                        clearInterval(this.nInterId);
                    }
                };
                if (this.nInterId == null) {
                    this.nInterId = window.setInterval(sendPoint, 1000);
                }
            }
        };
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
                            onChange={(event, value) => {
                                this.setState({desLon: value})
                            }}
                        />
                        <TextField
                            hintText="目标位置纬度"
                            onChange={(event, value) => {
                                this.setState({desLat: value})
                            }}
                        />
                    </ListItem>
                    <div style={{overflow: 'hidden'}}>
                    <FlatButton
                        label="开始导航"
                        style={{float: 'right'}}
                        onTouchTap={this.setDestination}
                    />
                    <FlatButton
                        label="取消导航"
                        style={{float: 'right'}}
                        onTouchTap={overLeader}
                    />
                    </div>
                    <div>
                        <FlatButton
                            label="DestinationDemo1"
                            style={{float: 'right'}}
                            onTouchTap={() => {
                                setCurrentPosition({latitude: '31.150695', longitude: '122.63159999999999'});
                                this.setState({desLat: '31.237', desLon: '122.061'});
                            }}
                        />
                    </div>
                        <FlatButton
                            label="测试值是否正常范围Demo"
                            style={{float: 'left'}}
                            onTouchTap={() => {
                                setTestStatus({
                                    status: true,
                                    type: 'valueRange',
                                    id: data[0].id,
                                    points: data[0].point,
                                    func: testValueRange
                                })
                            }}
                        />
                    <FlatButton
                        label="测试角度偏离"
                        style={{float: 'left'}}
                        onTouchTap={() => {
                            setTestStatus({
                                status: true,
                                type: 'angle',
                                id: data[0].id,
                                points: data[0].point,
                                func: testAngle
                            })
                        }}
                    />
                    <FlatButton
                        label="测试信号突然出现"
                        style={{float: 'left'}}
                        onTouchTap={() => {
                            setTestStatus({
                                status: true,
                                type: 'angle',
                                id: data[0].id,
                                points: data[0].point,
                                func: testSignalExist
                            })
                        }}
                    />
                    <FlatButton
                        label="测试信号突然消失"
                        style={{float: 'left'}}
                        onTouchTap={() => {
                            setTestStatus({
                                status: true,
                                type: 'angle',
                                id: data[0].id,
                                points: data[0].point,
                                func: testSignalDisappear
                            })
                        }}
                    />
                </Drawer>
            </div>
        )
    }
};
export default Slider;
