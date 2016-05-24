import Ember from 'ember';

export default Ember.Component.extend({
    createItem: function(){

    },
	didInsertElement: function(){
		this.$('#guestNumberBox').TouchSpin({
            min: 0,
            max: 100,
            step: 1,
            decimals: 0,
            boostat: 5,
            maxboostedstep: 10
    	});
    	// console.log("This is a test");
	}
});
