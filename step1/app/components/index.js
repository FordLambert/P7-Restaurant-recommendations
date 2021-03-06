import React, {Component} from 'react';

import Navigation from './Navigation';
import MapRestaurantList from './MapRestaurantList';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'listComplete': [],
            'listCustom': [],
            'restaurantRequested': {},
            'position': {}
        };

        this.map = {}; //updated by handleMapLoad
        this.grade = {min: 0, max: 5};
        this.order = 'grade';
    }

    handleMapLoad = (geolocCoordinates, map) => {
        this.map = map;

        fetch('./app/data/restaurant_list.json')
            .then(result => {
                return result.json();
            })
            .then(data => {
                this.setState({
                    listComplete: data,
                    listCustom: data,
                    position: geolocCoordinates
                });
                this.getVisiblesRestaurantsOnly();
            });
    }

    handleMarkerClick = (restaurant) => {
        this.setState({
            restaurantRequested: restaurant
        });
    }

    handleUserChoicesSubmit = (grade, order) => {
        this.grade = grade;
        this.order = order;
        this.getVisiblesRestaurantsOnly();
    }

    onDragEnd = () => {
        this.getVisiblesRestaurantsOnly();
    }

    getDistance(lat1, lon1, lat2, lon2) {
        //convert lat 1 and 2 from degree to radians
        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;

        //theta determine an angle between long 1 and 2
        const theta = lon1-lon2;
        //then convert it to radians
        const radtheta = Math.PI * theta/180;

        //multiply the sinus of (radians) lats, add the product of the long's (radians) cosine multiply by radtheta
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        //dist equal the cosine arc between our points
        dist = Math.acos(dist);

        //convert it back from radians to degree
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;

        //finally convert it to kilometers
        return dist * 1.609344;
    }

    getAverageGrade(restaurant) {
        const reviewNumber = restaurant.ratings.length;
        let total = 0;
        let finalGrade = 0;

        if (reviewNumber > 0) {
            
            restaurant.ratings.map(function(restaurantReview) {
                total += restaurantReview.stars;
            });

            finalGrade = Math.round((total/reviewNumber) * 100) / 100;
        }
        return finalGrade;
    }

    getVisiblesRestaurantsOnly = () => {
        const visibleRestaurantsList = [];

        this.state.listComplete.map((restaurant) => {
            const restaurantPosition = {lat: restaurant.lat, lng: restaurant.long};

            if (this.map.getBounds().contains(restaurantPosition)) {
                visibleRestaurantsList.push(restaurant)
            }
        });

        this.generateNewCustomList(visibleRestaurantsList);
    }

    //handle the form's submit for custom restaurant options
    generateNewCustomList = (restaurantList) => {

        const newList = [];
        restaurantList.map((restaurant) => {
            const overallGrade = this.getAverageGrade(restaurant);

            if ((overallGrade >= this.grade.min) && (overallGrade <= this.grade.max)) {
                newList.push(restaurant);
            }
        });

        //sort the newly created custom array
        //sort array by distance
        if (this.order == 'distance') {
            newList.sort((a, b) => {
                const distA = this.getDistance(this.state.position.lat, this.state.position.lng, a.lat, a.long);
                const distB = this.getDistance(this.state.position.lat, this.state.position.lng, b.lat, b.long);
                return distA - distB;
            });

        //sort array by averageGrade
        } else if (this.order == 'grade') {
            newList.sort((a, b) => {
                return this.getAverageGrade(b) - this.getAverageGrade(a);
            });

        //handle wrong parameter
        } else {
            console.log('Error: list order must be "distance" or "grade"')
        }

        this.setState({
            listCustom: newList
        });
    }

    render() {
        return (
            <div className='row'>
                <Navigation
                    handleUserChoicesSubmit={this.handleUserChoicesSubmit}
                />
                <MapRestaurantList
                    handleMarkerClick={this.handleMarkerClick}
                    handleMapLoad={this.handleMapLoad}
                    restaurantList={this.state.listCustom}
                    restaurantRequested={this.state.restaurantRequested}
                    onDragEnd={this.onDragEnd}
                />
            </div>
        );
    }
}