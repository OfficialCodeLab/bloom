import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('keypress-extender', 'Integration | Component | keypress extender', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{keypress-extender}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#keypress-extender}}
      template block text
    {{/keypress-extender}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
