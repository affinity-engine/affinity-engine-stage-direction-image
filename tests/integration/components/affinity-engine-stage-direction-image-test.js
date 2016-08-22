import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { initialize as initializeHook } from 'ember-hook';
import { initializeQUnitAssertions } from 'ember-message-bus';
import { initialize as initializeStage } from 'affinity-engine-stage';

const {
  getOwner
} = Ember;

moduleForComponent('affinity-engine-stage-direction-image', 'Integration | Component | Affinity Engine stage direction image', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeQUnitAssertions(appInstance);
    initializeStage(appInstance);
  }
});

test('`src` is assigned by directable.src', function(assert) {
  assert.expect(1);

  this.set('directable', { src: 'foo', transitions: [] });

  this.render(hbs`{{affinity-engine-stage-direction-image directable=directable engineId="foo"}}`);

  assert.equal(this.$('img').attr('src'), 'foo', 'src is correct');
});
