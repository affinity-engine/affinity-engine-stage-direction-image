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
  assert.expect(27);

  visit('/image').then(() => {
    assert.ok($hook('affinity_engine_stage_direction_image').length > 0, 'image is rendered by transition');
    assert.ok($hook('affinity_engine_stage_direction_image').hasClass('foofoo'), 'has custom class name');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')} img`).attr('src').match('engine/images/classroom.png'), 'it sets the `src` based on the associated fixture');
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
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(2) img`).attr('src').match('engine/images/beach-day.jpg'), 'it uses the default keyframe');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 3, '`compose` does not create a new image');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(2) img`).attr('src').match('engine/images/beach-night.jpg'), 'it changes the src of the image');

    return step(100);
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_image').length, 4, 'composed images can render');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img`).length, 4, 'composed images consist of multiple frames');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:first`).attr('src').match('affinity-engine/images/diy-base.png'), 'it renders images in ascending order');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:nth(1)`).attr('src').match('affinity-engine/images/diy-default-lips.png'), 'it renders the default lips');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:nth(3)`).attr('src').match('affinity-engine/images/diy-default-nose.png'), 'it renders nose');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:last`).attr('src').match('affinity-engine/images/diy-default-hair.png'), 'last composed image correct');

    return step(100);
  }).then(() => {
    assert.equal(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3)`).children(hook('ember_animation_box')).css('margin'), '10px', '`position` positions the character');

    return step(100);
  }).then(() => {
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img`).length, 5, '`compose` can add a new layer');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:nth(2)`).attr('src').match('affinity-engine/images/diy-embarrassed-lips.png'), 'it renders the embarrassed lips');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:nth(4)`).attr('src').match('affinity-engine/images/diy-default-nose.png'), 'it still renders nose');

    return step(100);
  }).then(() => {
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img`).length, 4, '`compose` can remove a layer');
    assert.ok(Ember.$(`${hook('affinity_engine_stage_direction_image')}:nth(3) img:nth(1)`).attr('src').match('affinity-engine/images/diy-default-lips.png'), 'it returns to the default lips');
  });
});
