import Ember from 'ember';
  import ColumnDefinition from 'ember-bootstrap-table/models/column-definition';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	showVendors: true,
	showUsers: true,
	hideVendors: false,
	displayType: Ember.computed('hideVendors', function(){
        if (this.get('hideVendors')) {
            return "Only displaying users";
        } else {
            return "Displaying users & vendors";
        }
    }),
		columns: Ember.computed(function() {
          var col1 = ColumnDefinition.create({
              header: 'Name',
							isSortable: true,
							textAlign: 'left',
							isFilterable: true,
              contentPath: 'fullName'
          });
          var col2 = ColumnDefinition.create({
              header: 'Email',
							isSortable: true,
							textAlign: 'left',
							isFilterable: true,
              contentPath: 'email',
          });

          var col3 = ColumnDefinition.create({
              header: 'Joined',
							isSortable: true,
							textAlign: 'left',
							isFilterable: true,
              contentPath: 'joinedDate'
          });

          var col4 = ColumnDefinition.create({
              header: 'Accounts',
							isSortable: false,
							contentPath: '',
							textAlign: 'left',
							isFilterable: false,
              columnComponentName: 'user-account'
          });

          var col5 = ColumnDefinition.create({
              header: 'Delete',
							isSortable: false,
							contentPath: '',
							textAlign: 'left',
							isFilterable: false,
              columnComponentName: 'user-delete'
          });
          var col6 = ColumnDefinition.create({
              header: 'Account Type',
							isSortable: false,
							contentPath: 'accType',
							textAlign: 'left',
							isFilterable: true
          });

          return [col1, col2, col3, col4, col5, col6];
      }),
			actions: {
				testingThis: function(id){
					alert(id);
				},
				// testThis(id){
				// 		this.send('testThis', id);
				// }
			}
});

  // name: attr('string'),
  // surname: attr('string'),
  // spouse: attr('string'),
  // email: attr('string'),
  // addressL1: attr('string'),
  // addressL2: attr('string'),
  // city: attr('string'),
  // country: attr('string'),
  // postalcode: attr('string'),
  // cell: attr('string'),
  // accountType: attr('string'),
