import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Review from './review';
import CloseButton from './close-button';
import ClosingInput from './closing_input';
import ReviewTitle from './review_title';
import Placeholder from './placeholder';

export default class ReviewList extends Component {

    static propTypes = {
        currentRestaurant: PropTypes.object
    }

    chooseRenderComponent(restaurant) {
        if (restaurant.ratings != undefined) {
            return restaurant.ratings.map(function(review, index){
                return <Review key={index} review={review} />
            }.bind(this))
        } else {
            return <Placeholder />
        }
    }
  
    render() {
        return (
            <div className={'sliding-wrapper'} id={'review-list'}>
                <ClosingInput />
                <aside>
                    <div className="row justify-content-center">
                        <ReviewTitle content={this.props.currentRestaurant.restaurantName} />
                        <a href={'#!'} className={'offset-sm-1 col-3 col-sm-2 btn btn-info close-button'}>
                            Fermer
                        </a>
                        {this.chooseRenderComponent(this.props.currentRestaurant)}
                    </div>
                </aside>
            </div>
        );
    }
}