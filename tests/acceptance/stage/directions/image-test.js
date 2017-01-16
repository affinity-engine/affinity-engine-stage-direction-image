import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';

moduleForAcceptance('Acceptance | affinity-engine/stage/directions/image', {
  beforeEach() {
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Affinity Engine | stage | Directions | Image', function(assert) {
  assert.expect(14);

  const done = assert.async();

  visit('/image').then(() => {
    assert.ok($hook('affinity_engine_stage_direction_image').length > 0, 'image is rendered by transition');
    assert.ok($hook('affinity_engine_stage_direction_image').hasClass('foofoo'), 'has custom class name');
    assert.equal(parseFloat($hook('affinity_engine_stage_direction_image').children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0, 'opacity starts at 0');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('affinity_engine_stage_direction_image').children(hook('ember_animation_box')).css('opacity')).toFixed(1), 1, '`fadeIn` sets opacity to 1');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('affinity_engine_stage_direction_image').children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0, '`fadeOut` sets opacity to 0');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('affinity_engine_stage_direction_image').children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.2, '`transition` can change css');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat($hook('affinity_engine_stage_direction_image').children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, '`transition`s can be chained');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 2, 'multiple instances of the same image can be rendered by setting `instance`');

    return step(100);
  }).then(() => {
    assert.equal(parseFloat(Ember.$(`${hook('affinity_engine_stage_direction_image')}:first`).children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.5, 'instances respond independently to `transition`s: 1');
    assert.equal(parseFloat(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(1)`).children(hook('ember_animation_box')).css('opacity')).toFixed(1), 0.6, 'instances respond independently to `transition`s: 2');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 3, 'images with different fixtures can co-exist on screen');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 3, '`compose` does not create a new image');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 4, 'composed images can render');

    return step(100);
  }).then(() => {
    assert.equal(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3)`).children(hook('ember_animation_box')).css('margin'), '10px', '`position` positions the character');

    done();
  });
});
