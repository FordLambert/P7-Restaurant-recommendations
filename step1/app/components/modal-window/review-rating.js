import React from 'react';

import StarRatingComponent from 'react-star-rating-component';

export class ReviewRating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 1
        };
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }

    render() {
        const { rating } = this.state;

        return (                
            <div className={'form-rating'}>
                <StarRatingComponent 
                    name="review-rating"
                    starCount={5}
                    value={rating}
                    onStarClick={this.onStarClick.bind(this)}
                />
            </div>
        );
    }
}