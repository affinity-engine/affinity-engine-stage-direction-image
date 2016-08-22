import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { configurable, deepArrayConfigurable, registrant } from 'affinity-engine';
import { Direction } from 'affinity-engine-stage';

const {
  computed,
  get,
  isBlank,
  merge,
  set,
  typeOf
} = Ember;

const configurationTiers = [
  '_attrs',
  'fixture',
  'config.attrs.component.stage.direction.image',
  'config.attrs.component.stage',
  'config.attrs'
];

export default Direction.extend({
  componentPath: 'affinity-engine-stage-direction-image',
  layer: 'engine.stage.foreground.image',

  config: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  attrs: computed(() => new Object({
    animationAdapter: configurable(configurationTiers, 'animationLibrary'),
    caption: configurable(configurationTiers, 'caption'),
    src: configurable(configurationTiers, 'src'),
    transitions: deepArrayConfigurable(configurationTiers, '_attrs.transitions')
  })),

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixture = this._findFixture(fixtureOrId);

    set(this, 'attrs.imageCategory', 'images');
    set(this, 'attrs.fixture', fixture);

    return this;
  },

  _reset() {
    return this._super({ transitions: Ember.A() });
  },

  caption(caption) {
    this._entryPoint();

    set(this, '_attrs.caption', caption);

    return this;
  },

  delay(duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, '_attrs.transitions') || set(this, '_attrs.transitions', []);

    transitions.push(merge({ duration }, options));

    return this;
  },

  transition(effect, duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, '_attrs.transitions') || set(this, '_attrs.transitions', []);

    transitions.push(merge({ duration, effect }, options));

    return this;
  },

  frame(fixtureOrId, transition = {}) {
    this._entryPoint();

    const transitions = get(this, '_attrs.transitions') || set(this, '_attrs.transitions', []);
    const fixture = this._findFixture(fixtureOrId);

    if (isBlank(transition.crossFade)) {
      transition.crossFade = {};
    }
    if (isBlank(transition.crossFade.in)) {
      transition.crossFade.in = { effect: { opacity: 1 } };
    }
    if (isBlank(transition.crossFade.out)) {
      transition.crossFade.out = { effect: { opacity: 0 } };
    }

    transition.crossFade.cb = () => {
      set(this, 'attrs.fixture', fixture);
      set(this, 'directable.fixture', fixture);
      set(this, 'directable.caption', get(this, 'attrs.caption'));
    };

    transitions.pushObject(transition);

    return this;
  },

  _findFixture(fixtureOrId) {
    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find('images', fixtureOrId);
  }
});
