import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { configurable, deepArrayConfigurable, registrant } from 'affinity-engine';
import { Direction } from 'affinity-engine-stage';

const {
  assign,
  computed,
  get,
  isBlank,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'affinity-engine-stage-direction-image',
  layer: 'engine.stage.foreground.image',

  attrs: computed(() => Ember.Object.create({
    transitions: []
  })),

  config: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  _configurationTiers: [
    'attrs',
    'attrs.fixture',
    'config.attrs.component.stage.direction.image',
    'config.attrs.component.stage',
    'config.attrs'
  ],

  _directableDefinition: computed('_baseImageDirectableDefinition', {
    get() {
      return get(this, '_baseImageDirectableDefinition');
    }
  }),

  _baseImageDirectableDefinition: computed('_configurationTiers', {
    get() {
      const configurationTiers = get(this, '_configurationTiers');

      return {
        imageCategory: 'images',
        animationAdapter: configurable(configurationTiers, 'animationLibrary'),
        caption: configurable(configurationTiers, 'caption'),
        fixture: configurable(configurationTiers, 'fixture'),
        src: configurable(configurationTiers, 'src'),
        transitions: deepArrayConfigurable(configurationTiers, 'attrs.transitions', 'transition')
      };
    }
  }),

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixture = this._findFixture(fixtureOrId);

    set(this, 'attrs.fixture', fixture);

    return this;
  },

  _reset() {
    this._super();

    get(this, 'attrs.transitions').length = 0;
  },

  caption(caption) {
    this._entryPoint();

    set(this, 'attrs.caption', caption);

    return this;
  },

  delay(duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.push(assign({ duration }, options));

    return this;
  },

  transition(effect, duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');

    transitions.push(assign({ duration, effect }, options));

    return this;
  },

  frame(fixtureOrId, transition = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');
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
      set(this, 'directable.attrs.fixture', fixture);
    };

    transitions.push(transition);

    return this;
  },

  _findFixture(fixtureOrId) {
    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find('images', fixtureOrId);
  }
});
