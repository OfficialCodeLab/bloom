import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('vendor-signup-form', 'Integration | Component | vendor signup form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{vendor-signup-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#vendor-signup-form}}
      template block text
    {{/vendor-signup-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
