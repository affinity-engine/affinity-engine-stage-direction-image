import Ember from 'ember';
import { registrant } from 'affinity-engine';

const {
  Component,
  computed,
  get
} = Ember;

export default Component.extend({
  classNames: ['ae-stage-direction-image-frame'],
  hook: 'affinity_engine_stage_direction_image_frame',

  translator: registrant('affinity-engine/translator'),

  didRender(...args) {
    this._super(...args);

    const captionTranslation = get(this, 'captionTranslation');
    const image = get(this, 'image');
    const $image = this.$(image).clone();

    $image.attr('alt', captionTranslation);

    this.$().empty().append($image);
  },

  captionTranslation: computed('fixtureId', 'caption', 'imageCategory', {
    get() {
      const caption = get(this, 'caption.key') || get(this, 'caption');
      const key = caption || `${get(this, 'imageCategory')}.${get(this, 'fixtureId')}`;

      return get(this, 'translator').translate(key, get(this, 'caption.options')) || caption;
    }
  }).readOnly(),

  image: computed('imageElement', 'src', {
    get() {
      return get(this, 'imageElement') || `<img src="${get(this, 'src')}">`;
    }
  }).readOnly()
});
