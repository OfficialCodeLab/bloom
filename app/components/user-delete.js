//users-table-delete-column.js
import Ember from 'ember';
import VcaTableColumn from 'ember-bootstrap-table/components/eb-table-column';
const { getOwner } = Ember;

export default VcaTableColumn.extend({
  //  layout: Ember.HTMLBars.compile(''),
   actions: {
     testThis: function(row) {
         console.log(row.id);
        //  console.log(getOwner(this));
         this.get('targetObject').send('testingThis', row.id);
     }
   }
});
