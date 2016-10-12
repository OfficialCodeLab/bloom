import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('background-scroller', 'Integration | Component | background scroller', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{background-scroller}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#background-scroller}}
      template block text
    {{/background-scroller}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
