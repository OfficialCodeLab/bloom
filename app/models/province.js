
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
	country: belongsTo('country', {inverse: 'province', async: true}),
	code: attr('string'),
	name: attr('string'),
	catItems: hasMany('cat-item', {inverse: 'province', async: true})
});
