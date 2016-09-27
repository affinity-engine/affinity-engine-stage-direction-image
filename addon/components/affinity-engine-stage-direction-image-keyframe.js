import Ember from 'ember';
import { registrant } from 'affinity-engine';

const {
  Component,
  computed,
  get,
  isPresent
} = Ember;

export default Component.extend({
  classNames: ['ae-stage-direction-image-frame-container'],
  hook: 'affinity_engine_stage_direction_image_frame',

  translator: registrant('affinity-engine/translator'),

  didRender(...args) {
    this._super(...args);

    const captionTranslation = get(this, 'captionTranslation');
    const heightRatio = get(this, 'heightRatio');
    const image = get(this, 'image');
    const $image = this.$(image);

    $image.addClass('ae-stage-direction-image-frame');
    $image.attr('alt', captionTranslation);

    if (isPresent(heightRatio)) { $image.css('height', `${heightRatio}px`); }

    this.$().empty().append($image);
  },

  heightRatio: computed('height', {
    get() {
      const height = get(this, 'height');

      if (isPresent(height)) { return this.$().closest('.ae-stage-direction-image-type').height() * (height / 100); }
    }
  }),

  captionTranslation: computed('keyframeId', 'caption', {
    get() {
      const caption = get(this, 'caption.key') || get(this, 'caption');
      const key = caption || `keyframes.${get(this, 'keyframeId')}`;

      return get(this, 'translator').translate(key, get(this, 'caption.options')) || caption;
    }
  }).readOnly(),

  image: computed('src', {
    get() {
      return `<img src="${get(this, 'src')}">`;
    }
  }).readOnly()
});
