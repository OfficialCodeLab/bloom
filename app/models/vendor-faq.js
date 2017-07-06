import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  question: attr('string'),
  answer: attr('string')
});
