import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tour-favourites', 'Integration | Component | tour favourites', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tour-favourites}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tour-favourites}}
      template block text
    {{/tour-favourites}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
