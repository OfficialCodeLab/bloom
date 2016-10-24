import Ember from 'ember';
import MdlSwitchMixin from 'pear/mixins/mdl-switch';
import { module, test } from 'qunit';

module('Unit | Mixin | mdl switch');

// Replace this with your real tests.
test('it works', function(assert) {
  let MdlSwitchObject = Ember.Object.extend(MdlSwitchMixin);
  let subject = MdlSwitchObject.create();
  assert.ok(subject);
});
