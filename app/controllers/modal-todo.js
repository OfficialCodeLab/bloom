import Ember from 'ember';
import format from 'ember-moment/computeds/format';

export default Ember.Controller.extend({
  notifications: Ember.inject.service('notification-messages'),
  dateCurrent: format(),

  actions: {
    dateChanged: function (date, valid){
      if(valid){      
        var model = this.get('model');   
        model.set('due', date);     
      }
    },
  }
});
