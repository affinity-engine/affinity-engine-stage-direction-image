import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image-layer';

const {
  Component,
  computed
} = Ember;

const { equal } = computed;

export default Component.extend({
  layout,

  classNames: ['ae-stage-direction-image-layer'],
  classNameBindings: ['isBase:ae-stage-direction-image-layer-base'],
  hook: 'affinity_engine_stage_direction_image_layer',

  isBase: equal('layer', 'base')
});
