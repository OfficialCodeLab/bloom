import Ember from 'ember';

export default Ember.Route.extend({

	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
          }

      	  let _id = this.get("session").content.currentUser.id + "";
          let user = this.store.peekRecord('user', _id);
          if(!user.get('vendorAccount')){
          	this.transitionTo('index.vendor.login');
          }

          return sesh;
    },
    model() {
    	return this.store.findAll('category');
    },
    actions: {
		createItem(){
			try{
				this.controller.set('isCreating', true);
				let cat = this.store.peekRecord('category', this.controller.get('category'));
				let _id = this.get("session").content.currentUser.id + "";
				let user = this.store.peekRecord('user', _id);
				this.store.findRecord('vendor', user.get('vendorAccount')).then((vndr) => {
					let newItem = this.store.createRecord('cat-item', {				
					  name: this.controller.get('name'),			
					  desc: this.controller.get('desc'),			
					  price: this.controller.get('price'),
					  category: cat,
					  vendor: vndr,
					  imageURL: this.controller.get('imageURL')
					});
					newItem.save().then(()=>{
						cat.get('catItems').pushObject(newItem);
						cat.save().then(()=>{		
							vndr.get('catItems').pushObject(newItem);
							vndr.save().then(()=>{
								this.controller.set('name', '');
								this.controller.set('price', '');
								this.controller.set('desc', '');
								this.controller.set('imageURL', '');
								this.controller.set('isCreating', false);
								this.transitionTo('index.vendor');
							});
						});	
					});
				});
			} catch(ex){
				this.controller.set('isCreating', false);
				alert("Please select a category or there was a problem");
			}
		}
	}
});
