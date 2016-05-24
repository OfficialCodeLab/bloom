import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('touch-spin', 'Integration | Component | touch spin', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{touch-spin}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#touch-spin}}
      template block text
    {{/touch-spin}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
