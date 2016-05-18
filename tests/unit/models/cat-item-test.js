import { moduleForModel, test } from 'ember-qunit';

moduleForModel('cat-item', 'Unit | Model | cat item', {
  // Specify the other units that are required for this test.
  needs: ['model:category', 'model:vendor']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
