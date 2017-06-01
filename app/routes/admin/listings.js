import Ember from 'ember';

export default Ember.Route.extend({
beforeModel: function() {
  var sesh = this.get("session").fetch().catch(function() {});
  if (!this.get('session.isAuthenticated')) {
    this.transitionTo('login');
  }
  return sesh;
},
model(){
return this.store.findAll('cat-item', {reload: true}).then((items) => {
    return items.sortBy('priority').reverse();
  });
},
actions: {
		notImplemented() {
			// this.controller.get('notifications').info('This does nothing :)',{
	    //         autoClear: true
	    //     });

		},
    editValue(id) {
      let item = this.store.peekRecord('cat-item', id);
      console.log('this works');
      let val = item.get('priority') || 0;
  		let _modalData = this.store.createRecord('edit-value-modal', {
        '_id': id,
        'value': val,
      	'type': 'cat-item',
      	'field': 'priority',
      	'title': 'Edit Priority'
      });
     	//this.controller.set('modalDataId', _modalData.get('id'));
      this.send('storeModalValueData', _modalData.get('id'));
    	this.send('showModal', 'modal-edit-value', _modalData);
    }, //Figure out how to move this to application route
    // saveValue(){
    //   this.set('isSavingValue', true);
    //   let dataId = this.controller.get('modalDataId');
    //   let data = this.store.peekRecord('edit-value-modal', dataId);
    //   let item = this.store.peekRecord(data.type, data._id);
    //   item.set(data.field, data.value);
    //   item.save().then(()=>{
    //     this.set('isSavingValue', false);
    //     data.deleteRecord();
    //   });
    // },
    // closeEditValue() {
    //   if(this.get('isSavingValue') === false) { //Clear Dirty Model
    //     let dataId = this.controller.get('modalDataId');
    //     let data = this.store.peekRecord('edit-value-modal', dataId);
    //     data.deleteRecord();
    //   }
    // }
  }
});
