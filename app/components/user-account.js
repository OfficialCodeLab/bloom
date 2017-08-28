//users-table-delete-column.js
import Ember from 'ember';
import VcaTableColumn from 'ember-bootstrap-table/components/eb-table-column';
const { getOwner } = Ember;

export default VcaTableColumn.extend({
  //  layout: Ember.HTMLBars.compile(''),
   actions: {
       notImplemented: function(row) {
          //  console.log(row.id);
          alert("This does nothing");
          //  getOwner(this).lookup('controller:table').send('deleteUser', row);
       },
       openDb: function(row) {
           console.log(row.id);

          window.open("https://console.firebase.google.com/project/pear-server/database/data/users/"+row.id);
          //  getOwner(this).lookup('controller:table').send('deleteUser', row);
       }
   }
});
