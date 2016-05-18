import { moduleForModel, test } from 'ember-qunit';

moduleForModel('vendor', 'Unit | Model | vendor', {
  // Specify the other units that are required for this test.
  needs: ['model:cat-item']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
