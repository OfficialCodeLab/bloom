import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

export default Model.extend({	
	todoList: attr('boolean'),
	budgetCalc: attr('boolean'),
	guestListMailer: attr('boolean')
});
