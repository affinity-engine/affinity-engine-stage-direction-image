import Ember from 'ember';
import { registrant } from 'affinity-engine';

const {
  Component,
  computed,
  get,
  isPresent
} = Ember;

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['alt', 'src'],
  classNames: ['ae-stage-direction-image-frame'],
  hook: 'affinity_engine_stage_direction_image_frame',

  translator: registrant('affinity-engine/translator'),

  didRender(...args) {
    this._super(...args);

    this.$().css('height', get(this, 'heightRatio'));
  },

  heightRatio: computed('height', {
    get() {
      const height = get(this, 'height');

      if (isPresent(height)) { return this.$().closest('.ae-stage-direction-image-type').height() * (height / 100); }
    }
  }),

  alt: computed('keyframeId', 'caption', {
    get() {
      const caption = get(this, 'caption.key') || get(this, 'caption');
      const key = caption || `keyframes.${get(this, 'keyframeId')}`;

      return get(this, 'translator').translate(key, get(this, 'caption.options')) || caption;
    }
  }).readOnly()
});
