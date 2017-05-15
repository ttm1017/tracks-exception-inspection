/**
 * Created by taotanming on 17/4/15.
 */

import React, {Component} from 'react';
import 'leaflet/dist/leaflet.css';
import './index.scss';
import L from './chinaProvider';


export default class extends Component {
    componentDidMount() {
        //init
        const normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
                maxZoom: 18,
                minZoom: 2
            }),
            satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
                maxZoom: 18,
                minZoom: 2
            });
        // using tianditu server
        // const normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
        //         maxZoom: 18,
        //         minZoom: 5
        //     }),
        //     normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        //         maxZoom: 18,
        //         minZoom: 5
        //     }),
        //     imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
        //         maxZoom: 18,
        //         minZoom: 5
        //     }),
        //     imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
        //         maxZoom: 18,
        //         minZoom: 5
        //     });
        // const normalMap = L.layerGroup([normalm, normala]),
        //     satelliteMap = L.layerGroup([imgm, imga]);

        //common part
        const baseLayers = {
            "地图": normalMap,
            "影像": satelliteMap,
        };
        const overlayLayers = {};
        this.map = L.map("map", {
            zoom: 12,
            layers: [normalMap],
            zoomControl: false
        });
        L.control.layers(baseLayers, overlayLayers).addTo(this.map);
        L.control.zoom({
            zoomInTitle: '放大',
            zoomOutTitle: '缩小'
        }).addTo(this.map);

        //set marker
        this.map.locate({watch: true});
        //add marker
        this.markerIcon = L.icon({
            iconUrl: 'assets/images/marker-icon.png'
        });
        //set to make map setView
        this.currentPositionChange = true;


        //test
        // const mymap = L.map('map').setView([51.505, -0.09], 13);
        //
        // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        //     maxZoom: 18,
        //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        //     '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        //     'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        //     id: 'mapbox.streets'
        // }).addTo(mymap);
        //
        // L.marker([51.5, -0.09]).addTo(mymap);
        //
        // L.circle([51.508, -0.11], {
        //     color: 'red',
        //     fillColor: '#f03',
        //     fillOpacity: 0.5,
        //     radius: 500
        // }).addTo(mymap);
        //
        // L.polygon([
        //     [51.509, -0.08],
        //     [51.503, -0.06],
        //     [51.51, -0.047]
        // ]).addTo(mymap);

    }
    shouldComponentUpdate(nextProps, nextState) {
        //TODO:adjust the logic
        if (Object.keys(nextProps.currentPosition).length > 0 && nextProps.currentPosition.latitude !== nextProps.currentPosition.latitude && nextProps.currentPosition.longitude !== nextProps.currentPosition.longitude) {
            this.currentPositionChange = true;
            console.log('setCurrent');
            return true;
        }
        // if (destinationRoute.length > 0 && nextProps.destinationRoute.id !== this.props.destinationRoute.id) {
        //     return true;
        // }
        return true;
    }
    componentDidUpdate() {
        const {currentPosition, destinationRoute, testTrajectory} = this.props;
        if (currentPosition.latitude != null && this.currentPositionChange) {
            this.map.setView([currentPosition.latitude, currentPosition.longitude], 15);
            L.marker([currentPosition.latitude, currentPosition.longitude], {icon: this.markerIcon}).addTo(this.map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
            this.currentPositionChange = false;
        }
        if (destinationRoute.length > 0) {
            const allPolyLines = destinationRoute.map((value) => {
                return value.points;
            });
            const polyline = L.polyline(allPolyLines, {color: '#217ac0'}).addTo(this.map);
            this.map.setView([currentPosition.latitude, currentPosition.longitude], 8);
            L.marker([currentPosition.latitude, currentPosition.longitude], {icon: this.markerIcon}).addTo(this.map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
        }
        console.log('didUpdate');
        console.log(testTrajectory);
        if (testTrajectory.status) {
            const {setTestStatus} = this.props;

            testTrajectory.func.call(this, L, testTrajectory);

            setTestStatus({status: false});
        }
    }
    render() {
        return <div id="map"></div>
    }
}


