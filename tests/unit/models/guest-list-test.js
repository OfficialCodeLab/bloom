import { moduleForModel, test } from 'ember-qunit';

moduleForModel('guest-list', 'Unit | Model | guest list', {
  // Specify the other units that are required for this test.
  needs: ['model:guest']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
