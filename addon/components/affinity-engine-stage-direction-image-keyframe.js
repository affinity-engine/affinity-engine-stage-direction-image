import Ember from 'ember';
import { registrant } from 'affinity-engine';
import ResizeMixin from 'ember-resize-for-addons';

const {
  Component,
  computed,
  get,
  isPresent
} = Ember;

const { String: { htmlSafe } } = Ember;

export default Component.extend(ResizeMixin, {
  tagName: 'img',
  attributeBindings: ['alt', 'src', 'style'],
  classNames: ['ae-stage-direction-image-frame'],
  hook: 'affinity_engine_stage_direction_image_frame',

  preloader: registrant('affinity-engine/preloader'),
  translator: registrant('affinity-engine/translator'),

  didRender(...args) {
    this._super(...args);

    this.$().on('load', () => {
      this._fixParentWidth();
    });
  },

  didResize(...args) {
    this._super(...args);

    this._fixParentWidth();
  },

  _fixParentWidth() {
    if (get(this, 'isBase')) {
      const $layer = this.$().closest('.ae-stage-direction-image-layer-base');

      $layer.css('width', '');
      $layer.width(this.$().width());
    }
  },

  style: computed('height', {
    get() {
      const height = get(this, 'height');

      return htmlSafe(isPresent(height) ? `height: ${height}%;` : '');
    }
  }),

  src: computed('keyframe.src', {
    get() {
      const preloader = get(this, 'preloader');

      if (get(preloader, 'isPlaceholder')) { return get(this, 'keyframe.src'); }

      const keyframe = get(this, 'keyframe');
      const imageId = preloader.idFor(keyframe, 'src');
      const blob = preloader.getElement(imageId, true);
      const urlCreator = window.URL || window.webkitURL;

      return blob ? urlCreator.createObjectURL(blob) : get(keyframe, 'src');
    }
  }),

  alt: computed('keyframe.id', 'caption', {
    get() {
      const caption = get(this, 'caption.key') || get(this, 'caption');
      const key = caption || `keyframes.${get(this, 'keyframe.id')}`;

      return get(this, 'translator').translate(key, get(this, 'caption.options')) || caption;
    }
  }).readOnly()
});
