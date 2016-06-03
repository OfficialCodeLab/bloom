import Ember from 'ember';

export default Ember.Controller.extend({
	chartData: Ember.A([{
	        value: 300,
	        color: "#F7464A",
	        highlight: "#FF5A5E",
	        label: "Red"
	    }, {
	        value: 50,
	        color: "#46BFBD",
	        highlight: "#5AD3D1",
	        label: "Green"
	    }, {
	        value: 100,
	        color: "#FDB45C",
	        highlight: "#FFC870",
	        label: "Yellow"
	    }])
});