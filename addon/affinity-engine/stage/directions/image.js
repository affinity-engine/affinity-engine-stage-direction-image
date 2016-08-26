import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { classNamesConfigurable, configurable, deepArrayConfigurable, registrant } from 'affinity-engine';
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
  keyframeParentCategory: 'images',
  layer: 'engine.stage.foreground.image',

  attrs: computed(() => Ember.Object.create({
    transitions: []
  })),

  keyframeKeys: computed(() => { return {}; }),

  config: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  _configurationTiers: [
    'attrs',
    'attrs.keyframe',
    'attrs.keyframeParent',
    'config.attrs.component.stage.direction.image',
    'config.attrs.component.stage',
    'config.attrs'
  ],

  _directableDefinition: computed('_baseImageDirectableDefinition', {
    get() {
      return get(this, '_baseImageDirectableDefinition');
    }
  }),

  _baseImageDirectableDefinition: computed('_configurationTiers',  {
    get() {
      const configurationTiers = get(this, '_configurationTiers');

      return {
        animationAdapter: configurable(configurationTiers, 'animationLibrary'),
        caption: configurable(configurationTiers, 'caption'),
        customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
        keyframe: configurable(configurationTiers, 'keyframe'),
        keyframeParent: configurable(configurationTiers, 'keyframeParent'),
        src: configurable(configurationTiers, 'src'),
        transitions: deepArrayConfigurable(configurationTiers, 'attrs.transitions', 'transition')
      };
    }
  }),

  _setup(fixtureOrId) {
    this._entryPoint();

    const image = this._findFixture(get(this, 'keyframeParentCategory'), fixtureOrId);

    set(this, 'attrs.keyframeParent', image);
    set(this, 'attrs.keyframe', this._findKeyframe(image));

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

  classNames(classNames) {
    this._entryPoint();

    set(this, 'attrs.classNames', classNames);

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

  keyframe(fixtureOrKeys, transition = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions');
    const keyframeParent = get(this, 'attrs.keyframeParent');
    const keyframe = this._findKeyframe(keyframeParent, fixtureOrKeys);
    const crossFadeTransition = this._generateCrossFade(transition);

    crossFadeTransition.crossFade.cb = () => {
      set(this, 'attrs.keyframe', keyframe);
      set(this, 'directable.attrs.keyframe', keyframe);
    };

    transitions.push(crossFadeTransition);

    return this;
  },

  _generateCrossFade(transition) {
    if (isBlank(transition.crossFade)) {
      transition.crossFade = {};
    }
    if (isBlank(transition.crossFade.in)) {
      transition.crossFade.in = { effect: { opacity: 1 } };
    }
    if (isBlank(transition.crossFade.out)) {
      transition.crossFade.out = { effect: { opacity: 0 } };
    }

    return transition;
  },

  _findFixture(type, fixtureOrId) {
    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find(type, fixtureOrId);
  },

  _findKeyframe(parent, newKeys = {}) {
    const query = assign(get(this, 'keyframeKeys'), newKeys);
    const queryKeys = Object.keys(query);
    const keyframe = Ember.A(get(parent, 'keyframes')).find((keyframe) => {
      return Object.keys(keyframe).filter((key) => key !== 'id').concat(queryKeys).every((key) => {
        if (query[key] === undefined) { query[key] = 'default'; }
        if (keyframe[key] === undefined) { keyframe[key] = 'default'; }

        return query[key] === keyframe[key];
      });
    });

    return this._findFixture('keyframes', get(keyframe, 'id'));
  }
});
