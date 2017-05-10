/**
 * Created by taotanming on 2017/5/10.
 */

import React, {Component} from 'react';
import './index.scss';
import Drawer from 'material-ui/Drawer';

const Slider = (props) => {
    const { sliderOpen, handleSliderOpen } = props;
    return (
        <div>
            <Drawer
                docked={false}
                width={200}
                open={sliderOpen}
                onRequestChange={(open) => handleSliderOpen(open)}
            >
                {/*<MenuItem>Menu Item</MenuItem>*/}
                {/*<MenuItem>Menu Item 2</MenuItem>*/}
            </Drawer>
        </div>
    )
};
export default Slider;
