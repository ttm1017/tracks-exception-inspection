/**
 * Created by taotanming on 17/4/20.
 */

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Map from '../Map';

export default class extends Component {
    render() {

        return (
            <div className="wrapper">
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <Map />
                </MuiThemeProvider>
            </div>
        );
    }
}

