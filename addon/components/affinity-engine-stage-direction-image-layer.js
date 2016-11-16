import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image-layer';

const {
  Component,
  computed,
  get,
  isPresent,
  set
} = Ember;

const { equal } = computed;
const { String: { htmlSafe } } = Ember;
const { run: { later } } = Ember;

export default Component.extend({
  layout,

  attributeBindings: ['style'],
  classNames: ['ae-stage-direction-image-layer'],
  classNameBindings: ['isBase:ae-stage-direction-image-layer-base'],
  hook: 'affinity_engine_stage_direction_image_layer',

  isBase: equal('layer', 'base'),

  didInsertElement(...args) {
    this._super(...args);

    // For some reason, the parent element has a width of 0 even after the base image has
    // loaded. This forces the parent to have the same width as the image, and then removes
    // that width a little while later. For some reason, once the parent's width has been
    // corrected, it begins adjusting to the width of its child.
    if (get(this, 'isBase')) {
      this.$('img').on('load', () => {
        set(this, 'width', this.$('img').width());

        later(() => {
          set(this, 'width', undefined);
        }, 500);
      });
    }
  },

  style: computed('width', {
    get() {
      const width = get(this, 'width');

      return htmlSafe(isPresent(width) ? `width: ${width}px;` : '');
    }
  })
});
