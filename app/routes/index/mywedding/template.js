import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
	actions: {
		sendInvites: function () {

	    	this.controller.get('notifications').warning('Functionality coming soon!',{
                autoClear: true
            });  
		}
	},

    model(params) {
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";

        return this.store.findRecord('user', _id);
    },
	setupController: function (controller, model) {
     	this._super(controller, model);
        
        if (model.get("hasGender")) { // ATTEMPT TO FILL IN NAME
        	if(model.get("isFemale")) {
        		controller.set("name2", model.get("name"));
        		if(model.get("spouse")){
	        		controller.set("name1", model.get("spouse"));
	        	}
        	} else {
        		controller.set("name1", model.get("name"));
        		if(model.get("spouse")){
	        		controller.set("name2", model.get("spouse"));
	        	}
        	}
        } else {
        	controller.set("name2", model.get("name"));
        	if(model.get("spouse")){
        		controller.set("name1", model.get("spouse"));
        	}
        }

        if (model.get("email")) {
    		controller.set("contact", model.get("email"));
        }

        this.store.findRecord("wedding", model.get("id")).then((wedding)=>{
        	if(wedding.get("weddingDate")) {
        		let wd = moment(wedding.get("weddingDate")).format("MMMM Do YYYY - h:mm a");
        		controller.set('date', wd);
        		let before = moment(wedding.get("weddingDate")).subtract(3, 'months').format("Do MMMM YYYY");
        		controller.set('info3', "Please RSVP before " + before);
        	}

        });
    }
});
