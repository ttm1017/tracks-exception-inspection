/**
 * Created by taotanming on 2017/5/11.
 */

import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import './index.scss';

const Modal = (props) => {
    const {isModalShow} = props;
    let component;
    if (isModalShow) {
        component = (
          <div className="modal fixed">
              <CircularProgress
                  size={60}
                  thickness={7}
                  style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translateX(-50%)'
                  }}
              />
          </div>
        );
    }
    else {
        component = (
            <div className="modal">
            </div>
        );
    }
    return component;
};
export default Modal;