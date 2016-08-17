import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { initialize as initializeHook } from 'ember-hook';
import { initializeQUnitAssertions } from 'ember-message-bus';
import { initialize as initializeStage } from 'affinity-engine-stage';
import { deepStub } from 'affinity-engine';

const {
  getOwner,
  getProperties,
  setProperties
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

const configurationTiers = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.component.stage.direction.image',
  'config.attrs.component.stage',
  'config.attrs'
];

configurationTiers.forEach((priority) => {
  test(`src is assigned by priority ${priority}`, function(assert) {
    assert.expect(1);

    const stub = deepStub(priority, { src: 'foo' });

    setProperties(this, getProperties(stub, 'config', 'directable'));

    this.render(hbs`{{affinity-engine-stage-direction-image directable=directable config=config engineId="foo"}}`);

    assert.equal(this.$('img').attr('src'), 'foo', 'src is correct');
  });
});
