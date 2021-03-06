import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Restaurant from './Restaurant';
import Placeholder from './Placeholder';

export default class RestaurantList extends Component {
    static propTypes = {
        restaurantList: PropTypes.array,
        handleOpenReviewRequest: PropTypes.func
    }

    chooseComponentToRender(restaurantList) {
        if (restaurantList.length > 0) {

            return restaurantList.map((restaurant, index) => {
                return <Restaurant
                    key={index}
                    id={index}
                    handleOpenReviewRequest={this.handleOpenReviewRequest}
                    restaurant={restaurant}
                />;
            })

        } else {
            return <Placeholder />
        }
    }

    handleOpenReviewRequest = (restaurant) => {
        this.props.handleOpenReviewRequest(restaurant);
    }

    render() {
        return (
            <div className='restaurant-list'>
                <ul className='row justify-content-center justify-content-lg-start'>
                    {this.chooseComponentToRender(this.props.restaurantList)}
                </ul>
            </div>
        )
    }
}