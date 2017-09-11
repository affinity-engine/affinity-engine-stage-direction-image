import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { registrant } from 'affinity-engine';
import { Direction, cmd } from 'affinity-engine-stage';

const {
  assign,
  computed,
  get,
  isBlank,
  isPresent,
  merge,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'affinity-engine-stage-direction-image',
  keyframeParentCategory: 'images',

  keyframeKeys: computed(() => { return {}; }),

  config: multiton('affinity-engine/config', 'engineId'),
  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  _configurationTiers: [
    'component.stage.direction.image',
    'image',
    'component.stage.direction.every',
    'component.stage.every',
    'children'
  ],

  _setup: cmd({ render: true }, function(fixtureOrId, options) {
    const image = this._findFixture(get(this, 'keyframeParentCategory'), fixtureOrId);

    this.applyFixture(image);
    this.configure(merge({
      keyframeParent: image,
      layers: this._findDefaultLayers(image),
      transitions: Ember.A()
    }, options));

    this._applyDefaultPositions();
  }),

  delay: cmd({ async: true }, function(duration, options = {}) {
    const transitions = this.getConfiguration('transitions');

    transitions.pushObject(assign({ duration }, options));
  }),

  fadeIn: cmd({ async: true }, function(...args) {
    this.transition({ effect: { opacity: 1 } }, ...args);
  }),

  fadeOut: cmd({ async: true }, function(...args) {
    this.transition({ effect: { opacity: 0 } }, ...args);
  }),

  transition: cmd({ async: true, render: true }, function(options = {}) {
    this.getConfiguration('transitions').pushObject(options);
  }),

  position: cmd(function(positions, duration = 0, options = {}) {
    const effect = positions.split(' ').reduce((aggregator, position) => {
      return assign(aggregator, this.getConfiguration(`positions.${position}`));
    }, {});

    this.transition(assign({ effect, duration }, options));
  }),

  _applyDefaultPositions() {
    const position = this.getConfiguration('defaultPosition');

    if (isPresent(position)) this.position(position);
  },

  keyframe: cmd({ async: true }, function(key, durationOrTransition) {
    const duration = typeOf(durationOrTransition) === 'number' ? durationOrTransition : 750;
    const transition = typeOf(durationOrTransition) === 'object' ? durationOrTransition : {};
    this._generateCrossfade(duration, transition);
    const image = this.getConfiguration('keyframeParent');
    const layers = [{
      layer: 'base',
      keyframe: this._findFixture('keyframes', this._findKeyframeIdByKey(get(image, 'attrs.keyframes'), key))
    }];
    transition.crossFade.cb = () => {
      this.configure('layers', layers);
    }

    this.getConfiguration('transitions').pushObject(transition);
  }),

  state: cmd({ async: true }, function(key, durationOrTransition, twoWayFade) {
    const duration = typeOf(durationOrTransition) === 'number' ? durationOrTransition : 750;
    const transition = typeOf(durationOrTransition) === 'object' ? durationOrTransition : {};
    const state = get(this, '_state');

    if (Object.keys(key).every((id) => key[id] === state[id])) { return; }

    this._generateCrossfade(duration, transition, twoWayFade);

    assign(state, key);

    const image = this.getConfiguration('keyframeParent');
    const layerIds = this._findKeyframeIdsByState(image);
    const layerOrder = get(image, 'attrs.layerOrder');
    const layers = this.getConfiguration('layers').reduce((layers, layer, index) => {
      const id = get(layerIds, layerOrder[index]);

      layers.push(assign({}, layer, { keyframe: this._findFixture('keyframes', id) }));

      return layers;
    }, []);
    transition.crossFade.cb = () => {
      this.configure('layers', layers);
    }

    this.getConfiguration('transitions').pushObject(transition);
  }),

  _findKeyframeIdByKey(keyframes, key) {
    return keyframes.find((keyframe) => get(keyframe, 'id') === key).keyframe;
  },

  _compareArrays(a, b) {
    return a.length !== b.length || a.some((id, index) => id !== b[index])
  },

  _generateCrossfade(duration, transition, twoWayFade) {
    if (isBlank(transition.crossFade)) {
      transition.crossFade = {};
    }
    if (isBlank(transition.crossFade.in)) {
      transition.crossFade.in = { };
    }
    if (isBlank(transition.crossFade.in.effect)) {
      transition.crossFade.in.effect = { opacity: 1 };
    }
    if (isBlank(transition.crossFade.in.duration)) {
      transition.crossFade.in.duration = twoWayFade ? duration : 0;
    }
    if (isBlank(transition.crossFade.out)) {
      transition.crossFade.out = { };
    }
    if (isBlank(transition.crossFade.out.duration)) {
      transition.crossFade.out.duration = duration
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
      layerTransition.crossFade.out.static = true;
    }

    layerTransition.crossFade.cb = () => {
      set(layer, 'keyframe', keyframe);
    }

    return layerTransition;
  },

  _findDefaultLayers(image) {
    return isBlank(get(image, 'attrs.states')) ?
      this._findDefaultLayersByKeyframe(image) :
      this._findDefaultLayersByState(image);
  },

  _findDefaultLayersByKeyframe(image) {
    const keyframes = get(image, 'attrs.keyframe') || get(image, 'attrs.keyframes');
    const keyframeId = typeOf(keyframes) === 'array' ?
      keyframes.find((frame) => get(frame, 'default')).keyframe :
      keyframes;

    return [this._generateDefaultLayerTransition('base', this._findFixture('keyframes', keyframeId))];
  },

  _findDefaultLayersByState(image) {
    const defaultState = assign({}, get(image, 'attrs.defaultState'));

    set(this, '_state', defaultState);

    const layers = this._findKeyframeIdsByState(image);

    return get(image, 'attrs.layerOrder').map((layerName) => {
      const keyframeId = get(layers, layerName);
      const keyframe = this._findFixture('keyframes', keyframeId);

      return this._generateDefaultLayerTransition(layerName, keyframe);
    });
  },

  _findKeyframeIdsByState(image) {
    const idealState = get(this, '_state');

    return get(image, 'attrs.states').reduce((layers, state) => {
      if (Object.keys(idealState).every((key) => !state.key[key] || state.key[key] === idealState[key])) {
        assign(layers, state.layers);
      }

      return layers;
    }, {});
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
