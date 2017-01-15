import Ember from 'ember';
import { registrant } from 'affinity-engine';
import { ResizeMixin } from 'affinity-engine';

const {
  Component,
  computed,
  get,
  observer,
  on,
  set,
  typeOf
} = Ember;

const { computed: { readOnly } } = Ember;

export default Component.extend(ResizeMixin, {
  tagName: 'canvas',
  classNames: ['ae-stage-direction-image-canvas'],
  classNameBindings: ['canvasClass'],
  canvasClass: '',

  preloader: registrant('affinity-engine/preloader'),

  _preloaderIsPlaceholder: readOnly('preloader.isPlaceholder'),

  _renderMethods: {
    figure(images) {
      const ctx = this.element.getContext('2d');
      const { height, width } = images[0];
      const heightRatio = (get(this, 'height') || 100) / 100;
      const canvasHeight = window.innerHeight * heightRatio;
      const canvasWidth = width * (canvasHeight / height)

      this.element.height = canvasHeight;
      this.element.width = canvasWidth;
      set(this, 'canvasClass', 'ae-figure');

      images.forEach((image) => ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight));
    },
    cover(images) {
      const ctx = this.element.getContext('2d');
      const { height, width } = images[0];
      const heightMultiplier = (get(this, 'height') || 100) / 100;
      const transformPercent = heightMultiplier > 1 ? ((1 - heightMultiplier) / 3) * 100 : 0;
      let canvasHeight = window.innerHeight * heightMultiplier;
      let canvasWidth = window.innerWidth * heightMultiplier;
      const heightRatio = height / canvasHeight;
      const widthRatio = width / canvasWidth;

      if (heightRatio < widthRatio) {
        canvasWidth = width / heightRatio;
      } else if (widthRatio < heightRatio) {
        canvasHeight = height / widthRatio;
      }

      this.element.height = canvasHeight;
      this.element.width = canvasWidth;
      this.element.style.webkitTransform = `translateX(${transformPercent}%) translateY(${-1 * transformPercent}%)`;
      this.element.style.transform = `translateX(${transformPercent}%) translateY(${-1 * transformPercent}%)`;

      images.forEach((image) => ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight));
    }
  },

  _renderMethod: computed('renderMethod', {
    get() {
      const renderMethod = get(this, 'renderMethod');

      return typeOf(renderMethod) === 'function' ? renderMethod : get(this, `_renderMethods.${renderMethod}`);
    }
  }),

  didResize(...args) {
    this._super(...args);

    this._drawImage();
  },

  _drawImage: on('didInsertElement', observer('layers.@each.keyframe', function() {
    const promises = get(this, 'layers').reduce((promises, layer) => {
      const keyframe = get(layer, 'keyframe');

      if (keyframe) {
        promises.push(this._getImage(get(layer, 'keyframe')));
      }

      return promises;
    }, []);

    Ember.RSVP.all(promises).then((resolutions) => {
      const images = resolutions.map((resolution) => resolution.path[0]);

      get(this, '_renderMethod').bind(this)(images);
    })
  })),

  _getImage(keyframe) {
    return get(this, '_preloaderIsPlaceholder') ? this._getImageElement(keyframe) : this._getImageAsBlob(keyframe);
  },

  _getImageAsElement(keyframe) {
    const image = new Image;

    image.src = get(keyframe, 'src');

    return new Ember.RSVP.Promise((resolve) => {
      image.onload = resolve;
    });
  },

  _getImageAsBlob(keyframe) {
    const preloader = get(this, 'preloader');
    const imageId = preloader.idFor(keyframe, get(keyframe, 'src'));
    const blob = preloader.getElement(imageId, true);
    const urlCreator = window.URL || window.webkitURL;

    return Ember.RSVP.resolve(blob ? urlCreator.createObjectURL(blob) : this._getImageAsElement(keyframe));
  }
});
