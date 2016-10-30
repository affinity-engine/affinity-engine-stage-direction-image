import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { classNamesConfigurable, configurable, registrant } from 'affinity-engine';
import { Direction, cmd } from 'affinity-engine-stage';

const {
  assign,
  computed,
  get,
  isBlank,
  isPresent,
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
    'attrs.links',
    'attrs.fixtures.image',
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

  compose: cmd({ async: true }, function(key, durationOrTransition) {
    const duration = typeOf(durationOrTransition) === 'number' ? durationOrTransition : 750;
    const transition = typeOf(durationOrTransition) === 'object' ? durationOrTransition : {};
    const crossFadeTransition = this._generateCrossfade(transition, duration);
    const layers = get(this, 'attrs.layers');
    const identifiers = typeOf(key) === 'object' ? assign(get(this, '_identifiers'), key) : set(this, '_identifiers', key);

    const layerChanges = layers.map((layer) => {
      const oldKeyframeIds = get(layer, 'keyframes').map((keyframe) => get(keyframe, 'id'));
      const parentLayers = get(this, 'attrs.keyframeParent.layers');
      const newKeyframeIds = isPresent(parentLayers) ?
        this._findKeyframeIds(get(this, 'attrs.keyframeParent.layers'), get(layer, 'layer'), identifiers) :
        [get(this, 'attrs.keyframeParent.keyframes').find((keyframe) => get(keyframe, 'id') === key).keyframe];

      return (resolve) => {
        if (newKeyframeIds.length !== oldKeyframeIds.length || !newKeyframeIds.every((id, index) => id === oldKeyframeIds[index])) {
          const newKeyframes = newKeyframeIds.map((id) => this._findFixture('keyframes', id));
          const layerTransition = this._crossFadeLayer(layer, newKeyframes, crossFadeTransition);

          get(layer, 'transitions').pushObject(layerTransition);
        }

        later(() => { resolve(); }, duration);
      }
    });

    get(this, 'attrs.transitions').pushObject({ external: { layerChanges } });
  }),

  _generateCrossfade(transition, duration) {
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
      transition.crossFade.in.duration = duration / 1.25;
    }
    if (isBlank(transition.crossFade.out)) {
      transition.crossFade.out = { };
    }
    if (isBlank(transition.crossFade.out.effect)) {
      transition.crossFade.out.effect = { opacity: 0 };
    }
    if (isBlank(transition.crossFade.out.duration)) {
      transition.crossFade.out.duration = duration;
    }

    return transition;
  },

  _crossFadeLayer(layer, keyframes, genericTransition) {
    const layerTransition = {
      crossFade: assign({}, genericTransition.crossFade)
    };

    if (isBlank(keyframes)) {
      layerTransition.crossFade.out = {
        ...layerTransition.crossFade.out,
        static: true
      };
    }

    layerTransition.crossFade.cb = () => {
      set(layer, 'keyframes', keyframes);
    }

    return layerTransition;
  },

  _findDefaultLayers(image) {
    const defaultIdentifiers = get(image, 'defaultIdentifiers');
    const layers = get(image, 'layers');

    if (isBlank(layers)) {
      const keyframe = get(image, 'keyframe') || get(image, 'keyframes');
      const keyframeId = typeOf(keyframe) === 'array' ? keyframe.find((frame) => get(frame, 'default')) : keyframe;
      return [{
        layer: 'base',
        transitions: Ember.A([{ effect: { opacity: 1 }, duration: 0 }]),
        keyframes: [this._findFixture('keyframes', keyframeId)]
      }]
    }

    set(this, '_identifiers', defaultIdentifiers);

    return Ember.A(get(image, 'layerOrder').map((layerName) => {
      const keyframeIds = this._findKeyframeIds(layers, layerName, defaultIdentifiers);
      const keyframes = keyframeIds.map((keyframeId) => this._findFixture('keyframes', keyframeId));

      return {
        layer: layerName,
        transitions: Ember.A([{ effect: { opacity: 1 }, duration: 0 }]),
        keyframes
      };
    }));
  },

  _findKeyframeIds(layers, layerName, id) {
    const layer = get(layers, layerName).find((layer) => {
      const layerId = get(layer, 'id');

      return typeOf(layerId) === 'string' || typeOf(id) === 'string' ?
        layerId === id : this._findKeyframeIdFromArrayOrObject(layerId, id);
    }) || {};

    const keyframes = get(layer, 'keyframes') || get(layer, 'keyframe');

    return (typeOf(keyframes) === 'array' ? keyframes : [keyframes]).filter((id) => isPresent(id));
  },

  _findKeyframeIdFromArrayOrObject(layerIdOrArray, id) {
    return typeOf(layerIdOrArray) === 'array' ?
      layerIdOrArray.some((layerId) => this._findKeyframeIdFromArrayOrObject(layerId, id)) :
      Object.keys(layerIdOrArray).every((key) => layerIdOrArray[key] === id[key]);
  },

  _findFixture(type, fixtureOrId) {
    return typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find(type, fixtureOrId);
  }
});
