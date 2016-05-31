import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('j-query/slider-component', 'Integration | Component | j query/slider component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{j-query/slider-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#j-query/slider-component}}
      template block text
    {{/j-query/slider-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
