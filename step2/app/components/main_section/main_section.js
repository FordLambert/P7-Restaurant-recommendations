import React, {Component} from 'react';
import PropTypes from "prop-types";

import GoogleMap from './google_map/google_map';
import SearchResultFound from './search_results_found/search_resutl_found';
import RestaurantSection from './restaurant_section/restaurant_section';

export default class MainSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'listComplete': [],
            'listCustom': [],
            'restaurantRequested': {},
            'canAddRestaurant': false
        };

        this.geolocCoordinates = {};
    }

    static propTypes = {
        grade: PropTypes.object,
        order: PropTypes.string
    }

    getDistance(lat1, lon1, lat2, lon2) {
        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;
        const theta = lon1-lon2;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }

    getAverageGrade(restaurant) {
        let reviewNumber = restaurant.ratings.length;
        let total = 0;

        restaurant.ratings.map(function(restaurantReview){
            total += restaurantReview.stars;
        });

        return Math.round((total/reviewNumber) * 100) / 100;
    }

    componentWillReceiveProps(nextProps) {
        //create a new custom list based on user choices (grade)
        let newList = [];
        this.state.listComplete.map(function (restaurant) {
            let overallGrade = this.getAverageGrade(restaurant);
            if ((overallGrade >= nextProps.grade.min) && (overallGrade <= nextProps.grade.max)) {
                newList.push(restaurant);
            }
        }.bind(this));

        //sort the newly created custom array
        //sort array by distance
        if (nextProps.order == 'distance') {

            //only available if the user have geolocation
            if (this.geolocCoordinates != undefined) {
                newList.sort(function (a, b) {
                    let distA = this.getDistance(this.geolocCoordinates.lat, this.geolocCoordinates.lng, a.lat, a.long);
                    let distB = this.getDistance(this.geolocCoordinates.lat, this.geolocCoordinates.lng, b.lat, b.long);
                    return distA - distB;
                }.bind(this));
            } else {
                console.log('Error: Géolocation must be active to use this sorting option');
            }
        //sort array by averageGrade
        } else if (nextProps.order == 'grade') {
            newList.sort(function (a, b) {
                return this.getAverageGrade(b) - this.getAverageGrade(a);
            }.bind(this));
        //handle wrong parameter
        } else {
            console.log('Error: list order must be "distance" or "grade"')
        }
        this.setState({listCustom: newList});
    }

    handleMapLoad = (geolocCoordinates) => {
        fetch('./app/data/restaurant_list.json')
            .then(result => {
                return result.json();
            })
            .then(data => {
            this.geolocCoordinates = geolocCoordinates;
            this.setState({listComplete: data});
            this.setState({listCustom: data});
        });
    }

    handleOpenReview = (restaurant) => {
        this.setState({restaurantRequested: restaurant});
    }

    addRestaurant = (restaurant) => {
        let tempRestaurantList = this.state.listCustom;
        tempRestaurantList.push(restaurant);
        alert('Restaurant ajouté');
        this.setState({listCustom: tempRestaurantList});
    }

    toggleAddRestaurant = (status) => {
        this.setState({canAddRestaurant: status});
    }

    render() {
        return (
            <section className="col-12 col-md-9 col-xl-10 main-section" id="main-section">
                <div className="row">
                    <GoogleMap
                        restaurantList={this.state.listCustom}
                        handleMapLoad={this.handleMapLoad}
                        handleOpenReview={this.handleOpenReview}
                        canAddRestaurant={this.state.canAddRestaurant}
                        handleRestaurantAdded={this.addRestaurant}
                    />
                    <SearchResultFound
                        restaurantNumber={this.state.listCustom.length}
                        toggleAddRestaurant={this.toggleAddRestaurant}
                    />
                    <RestaurantSection
                        restaurantList={this.state.listCustom}
                        restaurantRequested={this.state.restaurantRequested}
                    />
                </div>
            </section>
        );
    }
}