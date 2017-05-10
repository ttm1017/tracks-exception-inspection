/**
 * Created by taotanming on 17/4/15.
 */

import React, {Component, PropTypes} from 'react';
import 'leaflet/dist/leaflet.css';
import './index.scss';
import L from 'leaflet';

export default class extends Component {
    componentDidMount() {
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        const markerIcon = L.icon({
            iconUrl: 'assets/images/marker-icon.png'
        });

        L.marker([51.5, -0.09], {icon: markerIcon}).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
    }
    render() {
        return <div id="map"></div>
    }
}