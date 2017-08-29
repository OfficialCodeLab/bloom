import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    testThis: function(row) {
        console.log(row.id);
       //  console.log(getOwner(this));
        this.get('targetObject').send('testingThis', row.id);
    }
  }
});
