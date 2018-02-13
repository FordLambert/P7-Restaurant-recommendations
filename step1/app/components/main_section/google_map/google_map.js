import React, {Component} from 'react';
import PropTypes from "prop-types";

import Map from './map';
import Pulser from './loading_pulser';

export default class GoogleMap extends Component {
    static propTypes = {
        restaurantList: PropTypes.array,
        handleMapLoad: PropTypes.func
    }

    handleMapLoad = () => {
        this.props.handleMapLoad();
    }

    render() {
        return (
            <div id={'map'}>
                <Pulser />
                <Map
                    list={this.props.restaurantList}
                    handleMapLoad={this.handleMapLoad}
                />
            </div>
        );
    }
}