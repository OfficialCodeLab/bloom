import Ember from 'ember';

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").get('currentUser').providerData[0].uid + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }
          return sesh;
    },
    model(){    	
	    let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		  let user = this.store.peekRecord('user', _id);
	      return Ember.RSVP.hash({
            vendor: this.store.findRecord('vendor', user.get('vendorAccount')),
            province: this.store.findRecord('country', 'south_africa').then((_country=>{
                return _country.get('province');
            })),
            vendorStat: this.store.findRecord('vendor-stat', user.get('vendorAccount'))
        });
      // return this.store.findAll('category');
    },
    setupController: function (controller, model) {
      this._super(controller, model);
      Ember.set(controller, 'province', model.province);
      Ember.set(controller, 'vendor', model.vendor);
      Ember.set(controller, 'vendorStat', model.vendorStat);
      controller.set('selectedProvince', model.vendor.get('province'));
      let vs = model.vendorStat;
      //If vendor is willing to travel, autopopulate
      let willingToTravel = vs.get('willingToTravel');
      if(willingToTravel === 'true'){
        let maxTravelDist = vs.get('maxTravelDist');
        controller.set('maxDist', maxTravelDist);
        controller.set('willingToTravel', '1');           
      } else if(willingToTravel === 'false') { 
        controller.set('willingToTravel', '2');
      } else {
        controller.set('willingToTravel', '3');
      }

      // let monthlyAnalytics = model.vendorStat.get('monthlyAnalytics');
      // let montlyNewsletter = monet.vendorStat.get('montlyNewsletter');
    },
    actions: {
    	saveChanges() {
        let vendor = this.controller.get('model.vendor');
        let vendorStat = this.controller.get('model.vendorStat');
        vendor.set('province', this.controller.get('selectedProvince'));
        let travelObj = this.retrieveTravelInfo();
        vendorStat.set('willingToTravel', travelObj.willingTravel);
        vendorStat.set('maxTravelDist', travelObj.travelDist);
        this.controller.set('isUpdating', true);
        vendor.save().then(() => {          
          vendorStat.save().then(() => {
           this.controller.set('isUpdating', false);
            this.controller.get('notifications').success('Changes have been saved!',{
                autoClear: true
              });

          });
        });
    	},
      select0: function(){
        this.controller.set('isSelected0', true);
        this.controller.set('isSelected1', false);
        this.controller.set('isSelected2', false);
      },
      select1: function(){
        this.controller.set('isSelected0', false);
        this.controller.set('isSelected1', true);
        this.controller.set('isSelected2', false);
      },
      select2: function(){
        this.controller.set('isSelected0', false);
        this.controller.set('isSelected1', false);
        this.controller.set('isSelected2', true);
      },
    	closeMessage(){
    		this.controller.set('responseMessage', '');
    	},

      checkBoxMN: function(){
        let vendorStat = this.controller.get('model.vendorStat');  
        let boolVal = vendorStat.get('montlyNewsletter');      
        if(boolVal) {
          vendorStat.set('montlyNewsletter', false);          
        } else {
          vendorStat.set('montlyNewsletter', true);  
        }
      },
      checkBoxMA: function(){
        let vendorStat = this.controller.get('model.vendorStat');  
        let boolVal = vendorStat.get('monthlyAnalytics');      
        if(boolVal) {
          vendorStat.set('monthlyAnalytics', false);          
        } else {
          vendorStat.set('monthlyAnalytics', true);  
        }
      },
    },
    retrieveTravelInfo: function(){
      let willingTravel;
      let travelDist;
      switch(this.controller.get('willingToTravel')){
            case '1': //Yes
                willingTravel = true;
                travelDist = this.controller.get('maxDist');
            break;

            case '2': //No
                willingTravel = false;
            break;

            default: //Na
                willingTravel = null;
            break;
        }

        return {
          willingTravel: willingTravel, 
          travelDist: travelDist
        };
  },
});
