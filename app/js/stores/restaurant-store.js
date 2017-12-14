'use strict';
const RestaurantStore = {
	init: function() {
		this.restaurantList = [];

		return this;
	}
}

RestaurantStore.addRestaurant = function(restaurant) {
	this.restaurantList.push(restaurant);
};

RestaurantStore.getRestaurant = function(index) {
	return this.restaurantList[index];
};