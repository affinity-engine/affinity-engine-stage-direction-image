import Ember from 'ember';
import { registrant } from 'affinity-engine';

const {
  Component,
  computed,
  get,
  isPresent
} = Ember;

const { String: { htmlSafe } } = Ember;

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['alt', 'src', 'style'],
  classNames: ['ae-stage-direction-image-frame'],
  hook: 'affinity_engine_stage_direction_image_frame',

  translator: registrant('affinity-engine/translator'),

  style: computed('height', {
    get() {
      const height = get(this, 'height');

      return htmlSafe(isPresent(height) ? `height: ${get(this, 'height')}%` : '');
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
