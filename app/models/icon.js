import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	title: attr('string'),
	desc: attr('string'),
	imageUrl: attr('string'),
	category: attr('string'),
  selected: false
});
