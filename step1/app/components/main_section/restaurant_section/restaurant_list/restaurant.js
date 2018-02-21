import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StreetPicture from './street_picture';
import RestaurantDetails from './restaurant_details';
import GlobalReview from './global_review';
import ReviewListButton from './review_list_button';

export default class Restaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: this.props.restaurant.lat.toString(),
            longitude: this.props.restaurant.long.toString()
        };
    }

    static propTypes = {
        restaurant: PropTypes.object,
        openReview: PropTypes.func,
        id: PropTypes.number,
        handleOpenReview: PropTypes.func
    }

    defineStarColor(grade) {
        if (grade >= 1 && grade <= 2) {
            return 'red-star';

        } else if (grade > 2 && grade < 4) {
            return 'orange-star';

        } else if (grade >= 4 && grade <= 5) {
            return 'green-star';

        } else {
            console.log('Error: rating must be  between 1 and 5');
        }
    }

    getAverageGrade(restaurant) {
        const reviewNumber = restaurant.ratings.length;
        let total = 0;

        restaurant.ratings.map(function(restaurantReview){
            total += restaurantReview.stars;
        });

        return Math.round((total/reviewNumber) * 100) / 100;
    }

    getSplitedAddress(spliter) {
        return this.props.restaurant.address.split(spliter);
    }

    handleOpenReview = () => {
        this.props.handleOpenReview(this.props.restaurant);
    }

    render() {
        return (
            <li className={'restaurant col-10 col-xl-5 align-self-center'}>
                <div className='row justify-content-around'>
                    <StreetPicture
                        address={this.props.restaurant.address}
                    />
                    <RestaurantDetails
                        restaurantName={this.props.restaurant.restaurantName}
                        address={this.getSplitedAddress(',')}
                        reviewNumber={this.props.restaurant.ratings.length}
                    />
                    <div className={'col-12 col-sm-3 col-xl-2'}>
                        <div className={'row justify-content-center'}>
                            <GlobalReview
                                averageGrade={this.getAverageGrade(this.props.restaurant)}
                                pictureName={this.defineStarColor(this.getAverageGrade(this.props.restaurant))}
                            />
                        </div>
                    </div>
                </div>
                <div className={'row justify-content-center justify-content-md-end'}>
                    <ReviewListButton
                        handleOpenReview={this.handleOpenReview}
                    />
                </div>
            </li>
        );
    }
}