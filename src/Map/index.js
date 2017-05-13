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
    }
    componentDidUpdate() {
        const {currentPosition} = this.props;

        const markerIcon = L.icon({
            iconUrl: 'assets/images/marker-icon.png'
        });
        if (currentPosition.latitude != null) {
            this.map.setView([currentPosition.latitude, currentPosition.longitude], 15);
            L.marker([currentPosition.latitude, currentPosition.longitude], {icon: markerIcon}).addTo(this.map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
        }
    }
    render() {
        return <div id="map"></div>
    }
}


