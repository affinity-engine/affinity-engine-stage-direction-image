import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image-layer';
import { ResizeMixin } from 'affinity-engine';

const {
  Component,
  computed,
  get,
  isPresent,
  set
} = Ember;

const { equal } = computed;
const { String: { htmlSafe } } = Ember;

export default Component.extend(ResizeMixin, {
  layout,

  classNames: ['ae-stage-direction-image-layer'],
  classNameBindings: ['isBase:ae-stage-direction-image-layer-base'],
  hook: 'affinity_engine_stage_direction_image_layer',

  isBase: equal('layer', 'base'),

  didRender(...args) {
    this._super(...args);

    this.$('img').one('load', () => { this._setWidth(); });
  },

  didResize(...args) {
    this._super(...args);

    this._setWidth();
  },

  _setWidth() {
    // For some reason, the parent element has a width of 0 even after the base image has
    // loaded. This forces the parent to have the same width as the image, and then removes
    // that width a little while later. For some reason, once the parent's width has been
    // corrected, it begins adjusting to the width of its child.
    if (get(this, 'isBase')) {
      this.$().css('width', '');
      this.$().width(this.$('img').width());
    }
  }
});
