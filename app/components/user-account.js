import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
      notImplemented: function(row) {
         //  console.log(row.id);
         alert("This does nothing");
         //  getOwner(this).lookup('controller:table').send('deleteUser', row);
      },
      openDb: function(row) {

         window.open("https://console.firebase.google.com/project/pear-server/database/data/users/"+row.get('id'));
         //  getOwner(this).lookup('controller:table').send('deleteUser', row);
      }
  }
});
