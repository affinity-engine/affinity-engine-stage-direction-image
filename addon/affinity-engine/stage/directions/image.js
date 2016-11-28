import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { classNamesConfigurable, configurable, registrant } from 'affinity-engine';
import { Direction, cmd } from 'affinity-engine-stage';

const {
  assign,
  computed,
  get,
  isBlank,
  set,
  typeOf
} = Ember;

const { run: { later } } = Ember;

export default Direction.extend({
  componentPath: 'affinity-engine-stage-direction-image',
  keyframeParentCategory: 'images',
  layer: 'engine.stage.foreground.image',

  attrs: computed(() => Ember.Object.create({
    transitions: Ember.A()
  })),

  keyframeKeys: computed(() => { return {}; }),

  config: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  _configurationTiers: [
    'attrs',
    'attrs.keyframe',
    'attrs.keyframeParent',
    'links.attrs',
    'links.fixtures.image',
    'config.attrs.component.stage.direction.image',
    'config.attrs.component.stage',
    'config.attrs.global'
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
        animationLibrary: configurable(configurationTiers, 'animationLibrary'),
        caption: configurable(configurationTiers, 'caption'),
        customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
        height: configurable(configurationTiers, 'height'),
        keyframeParent: configurable(configurationTiers, 'keyframeParent'),
        layers: configurable(configurationTiers, 'layers'),
        src: configurable(configurationTiers, 'src'),
        transitions: configurable(configurationTiers, 'transitions')
      };
    }
  }),

  _setup: cmd({ directable: true }, function(fixtureOrId) {
    const image = this._findFixture(get(this, 'keyframeParentCategory'), fixtureOrId);

    this._linkFixture(image);
    set(this, 'attrs.keyframeParent', image);
    set(this, 'attrs.layers', this._findDefaultLayers(image));
  }),

  caption: cmd(function(caption) {
    set(this, 'attrs.caption', caption);
  }),

  classNames: cmd(function(classNames) {
    set(this, 'attrs.classNames', classNames);
  }),

  delay: cmd({ async: true }, function(duration, options = {}) {
    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(assign({ duration }, options));
  }),

  fadeIn: cmd({ async: true }, function(...args) {
    this.transition({ opacity: 1 }, ...args);
  }),

  fadeOut: cmd({ async: true }, function(...args) {
    this.transition({ opacity: 0 }, ...args);
  }),

  height: cmd(function(height) {
    set(this, 'attrs.height', height);
  }),

  transition: cmd({ async: true }, function(effect, duration, options = {}) {
    const transitions = get(this, 'attrs.transitions');

    transitions.pushObject(assign({ duration, effect }, options));
  }),

  position: cmd(function(positions, duration = 0, options = {}) {
    const effect = positions.split(' ').reduce((aggregator, position) => {
      const nextEffectTier = Ember.A(get(this, '_configurationTiers')).find((tier) => {
        return get(this, `${tier}.positions.${position}`);
      });
      const nextEffect = get(this, `${nextEffectTier}.positions.${position}`);

      return assign(aggregator, nextEffect);
    }, {});

    this.transition(effect, duration, options);
  }),

  keyframe: cmd({ async: true }, function(key, durationOrTransition) {
    const duration = typeOf(durationOrTransition) === 'number' ? durationOrTransition : 750;
    const transition = typeOf(durationOrTransition) === 'object' ? durationOrTransition : {};
    const crossFadeTransition = this._generateCrossfade(duration, transition);
    const image = get(this, 'attrs.keyframeParent');

    const layerChanges = get(this, 'attrs.layers').map((layer) => {
      const oldKeyframeId = get(layer, 'keyframe.id');
      const newKeyframeId = this._findKeyframeIdByKey(get(image, 'keyframes'), key);

      return (resolve) => {
        if (newKeyframeId !== oldKeyframeId) {
          const newKeyframe = this._findFixture('keyframes', newKeyframeId);
          const layerTransition = this._crossFadeLayer(layer, newKeyframe, crossFadeTransition);

          get(layer, 'transitions').pushObject(layerTransition);
        }

        later(() => { resolve(); }, duration);
      }
    });

    get(this, 'attrs.transitions').pushObject({ external: { layerChanges } });
  }),

  state: cmd({ async: true }, function(key, durationOrTransition) {
    const duration = typeOf(durationOrTransition) === 'number' ? durationOrTransition : 750;
    const transition = typeOf(durationOrTransition) === 'object' ? durationOrTransition : {};
    const crossFadeTransition = this._generateCrossfade(duration, transition);
    const state = assign(get(this, '_state'), key);
    const image = get(this, 'attrs.keyframeParent');
    const layers = get(image, 'layers');

    const layerChanges = get(this, 'attrs.layers').map((layer) => {
      const oldKeyframeId = get(layer, 'keyframe.id');
      const newKeyframeId = this._findKeyframeIdByLayer(layers, get(layer, 'layer'), state);

      return (resolve) => {
        if (newKeyframeId !== oldKeyframeId) {
          const newKeyframe = this._findFixture('keyframes', newKeyframeId);
          const layerTransition = this._crossFadeLayer(layer, newKeyframe, crossFadeTransition);

          get(layer, 'transitions').pushObject(layerTransition);
        }

        later(() => { resolve(); }, duration);
      }
    });

    get(this, 'attrs.transitions').pushObject({ external: { layerChanges } });
  }),

  _findKeyframeIdByKey(keyframes, key) {
    return keyframes.find((keyframe) => get(keyframe, 'id') === key).keyframe;
  },

  _compareArrays(a, b) {
    return a.length !== b.length || a.some((id, index) => id !== b[index])
  },

  _generateCrossfade(duration, transition) {
    if (isBlank(transition.crossFade)) {
      transition.crossFade = {};
    }
    if (isBlank(transition.crossFade.in)) {
      transition.crossFade.in = { };
    }
    if (isBlank(transition.crossFade.in.effect)) {
      transition.crossFade.in.effect = { opacity: [1, 0] };
    }
    if (isBlank(transition.crossFade.in.duration)) {
      transition.crossFade.in.duration = duration;
    }
    if (isBlank(transition.crossFade.out)) {
      transition.crossFade.out = { };
    }
    if (isBlank(transition.crossFade.out.effect)) {
      transition.crossFade.out.effect = { opacity: 0 };
    }

    return transition;
  },

  _crossFadeLayer(layer, keyframe, genericTransition) {
    const layerTransition = {
      crossFade: assign({}, genericTransition.crossFade)
    };

    if (isBlank(keyframe)) {
      layerTransition.crossFade.out = {
        ...layerTransition.crossFade.out,
        static: true
      };
    }

    layerTransition.crossFade.cb = () => {
      set(layer, 'keyframe', keyframe);
    }

    return layerTransition;
  },

  _findDefaultLayers(image) {
    return isBlank(get(image, 'layers')) ?
      this._findDefaultLayersByKeyframe(image) :
      this._findDefaultLayersByState(image);
  },

  _findDefaultLayersByKeyframe(image) {
    const keyframes = get(image, 'keyframe') || get(image, 'keyframes');
    const keyframeId = typeOf(keyframes) === 'array' ?
      keyframes.find((frame) => get(frame, 'default')).keyframe :
      keyframes;

    return [this._generateDefaultLayerTransition('base', this._findFixture('keyframes', keyframeId))];
  },

  _findDefaultLayersByState(image) {
    const layers = get(image, 'layers');
    const defaultState = get(image, 'defaultState');

    set(this, '_state', defaultState);

    return get(image, 'layerOrder').map((layerName) => {
      const keyframeId = this._findKeyframeIdByLayer(layers, layerName, defaultState);
      const keyframe = this._findFixture('keyframes', keyframeId);

      return this._generateDefaultLayerTransition(layerName, keyframe);
    });
  },

  _generateDefaultLayerTransition(layer, keyframe) {
    return {
      layer,
      keyframe,
      transitions: Ember.A([{ effect: { opacity: 1 }, duration: 0 }])
    };
  },

  _findKeyframeIdByLayer(layers, layerName, state) {
    const layer = get(layers, layerName).find((layer) => {
      const layerState = get(layer, 'state');

      return typeOf(layerState) === 'string' || typeOf(state) === 'string' ?
        layerState === state : this._findKeyframeIdFromArrayOrObject(layerState, state);
    }) || {};

    return get(layer, 'keyframe');
  },

  _findKeyframeIdFromArrayOrObject(layerStateOrArray, state) {
    return typeOf(layerStateOrArray) === 'array' ?
      layerStateOrArray.some((layerState) => this._findKeyframeIdFromArrayOrObject(layerState, state)) :
      Object.keys(layerStateOrArray).every((key) => layerStateOrArray[key] === state[key]);
  },

  _findFixture(type, fixtureOrId) {
    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find(type, fixtureOrId);
  }
});
