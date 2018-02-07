import { moduleForModel, test } from 'ember-qunit';

moduleForModel('guest', 'Unit | Model | guest', {
  // Specify the other units that are required for this test.
  needs: ['model:guest-list']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
