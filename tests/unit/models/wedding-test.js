import { moduleForModel, test } from 'ember-qunit';

moduleForModel('wedding', 'Unit | Model | wedding', {
  // Specify the other units that are required for this test.
  needs: ['model:guest', 'model:user']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
