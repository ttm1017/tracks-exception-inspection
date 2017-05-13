/**
 * Created by taotanming on 2017/5/10.
 */

import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';

const AppBarExampleIcon = (props) => {
        const {leftTouchHandle, sliderOpen} = props;
        return (
            <AppBar
                title="轨迹异常检测系统"
                onLeftIconButtonTouchTap={() => leftTouchHandle(!sliderOpen)}
                style={{zIndex:10}}
            />
        );
    };
// const AppBarExampleIcon = () => (
//     <AppBar
//         title="Title"
//         iconClassNameRight="muidocs-icon-navigation-expand-more"
//     />
// );


export default AppBarExampleIcon;