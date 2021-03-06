import Ember from 'ember';
import { registrant } from 'affinity-engine';
import { ResizeMixin } from 'affinity-engine';
import { task, timeout } from 'ember-concurrency';

const {
  Component,
  computed,
  get,
  isPresent,
  observer,
  on,
  set,
  typeOf
} = Ember;

const { computed: { readOnly } } = Ember;

export default Component.extend(ResizeMixin, {
  tagName: 'canvas',
  classNames: ['ae-stage-direction-image-canvas'],
  classNameBindings: ['shouldBePointer:ae-pointed'],

  preloader: registrant('affinity-engine/preloader'),

  _preloaderIsPlaceholder: readOnly('preloader.isPlaceholder'),

  $stage: computed({
    get() {
      return this.$().closest('.ae-stage');
    }
  }),

  shouldBePointer: computed('clickable', 'inClickableRegion', {
    get() {
      return get(this, 'clickable') && get(this, 'inClickableRegion');
    }
  }),

  _heightForMedia: computed('height', {
    get() {
      const height = get(this, 'height');

      if (typeOf(height) === 'object') {
        return Object.keys(height).reduce((accumulator, key) => {
          if (key.includes('@media') && this._mediaQueryIsValid(key)) {
            return get(height, key);
          }

          return accumulator;
        }, get(height, 'default'));
      } else {
        return height || 100;
      }
    }
  }),

  _mediaQueryIsValid(string) {
    return string.match(/\(([^)]+?)\)/g).every((query) => {
      const [property, value] = query.substring(1, query.length - 1).split(':');

      switch (property) {
        case 'min-height': return this._hasMinHeight(value);
        case 'max-height': return this._hasMaxHeight(value);
        case 'min-width': return this._hasMinWidth(value);
        case 'max-width': return this._hasMaxWidth(value);
        default: return false;
      }
    });
  },

  _hasMinHeight(value) {
    return get(this, '$stage').height() >= parseInt(value, 10);
  },

  _hasMaxHeight(value) {
    return get(this, '$stage').height() <= parseInt(value, 10);
  },

  _hasMinWidth(value) {
    return get(this, '$stage').width() >= parseInt(value, 10);
  },

  _hasMaxWidth(value) {
    return get(this, '$stage').width() <= parseInt(value, 10);
  },

  _renderMethods: {
    figure(images) {
      const $stage = get(this, '$stage');
      const ctx = this.element.getContext('2d');
      const { height, width } = images[0];
      const heightRatio = get(this, '_heightForMedia') / 100;
      const canvasHeight = $stage.height() * heightRatio;
      const canvasWidth = width * (canvasHeight / height)

      requestAnimationFrame(() => {
        this.element.height = canvasHeight;
        this.element.width = canvasWidth;
        this.element.style.zIndex = 10;

        images.forEach((image) => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        });
      });
    },
    cover(images) {
      const $stage = get(this, '$stage');
      const ctx = this.element.getContext('2d');
      const { height, width } = images[0];
      const heightMultiplier = get(this, '_heightForMedia') / 100;
      const transformPercent = heightMultiplier > 1 ? ((1 - heightMultiplier) / 3) * 100 : 0;
      let canvasHeight = $stage.height() * heightMultiplier;
      let canvasWidth = $stage.width() * heightMultiplier;
      const heightRatio = height / canvasHeight;
      const widthRatio = width / canvasWidth;

      if (heightRatio < widthRatio) {
        canvasWidth = width / heightRatio;
      } else if (widthRatio < heightRatio) {
        canvasHeight = height / widthRatio;
      }

      requestAnimationFrame(() => {
        this.element.height = canvasHeight;
        this.element.width = canvasWidth;
        this.element.style.webkitTransform = `translateX(${transformPercent}%) translateY(${transformPercent}%)`;
        this.element.style.transform = `translateX(${transformPercent}%) translateY(${transformPercent}%)`;

        images.forEach((image) => ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight));
      });
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

    this.notifyPropertyChange('_heightForMedia');
    this._drawImage();
  },

  mouseMove(event) {
    this._super(event);

    if (!get(this, 'clickable')) return;

    const context = this.element.getContext('2d');
    const rect = this.element.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    const pixelData = context.getImageData(x, y, 1, 1).data;

    if (pixelData[3] === 0) {
      set(this, 'inClickableRegion', false);
    } else {
      set(this, 'inClickableRegion', true);
    }
  },

  click(event) {
    this._super(event);

    get(this, '_clickTask').perform(event);
  },

  _clickTask: task(function * (event) {
    const context = this.element.getContext('2d');
    const rect = this.element.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    const pixelData = context.getImageData(x, y, 1, 1).data;

    if (pixelData[3] === 0) {
      this.element.style.pointerEvents = 'none';
      document.elementFromPoint(event.clientX, event.clientY).
        dispatchEvent(new MouseEvent('click', event.originalEvent));
      yield timeout(10);
      this.element.style.pointerEvents = 'auto';
    } else {
      this.attrs.clicked(event);
    }
  }).drop(),

  _drawImage: on('didInsertElement', observer('layers.@each.keyframe', function() {
    const promises = get(this, 'layers').reduce((promises, layer) => {
      const keyframe = get(layer, 'keyframe');

      if (keyframe) {
        promises.push(this._getImage(get(layer, 'keyframe')));
      }

      return promises;
    }, []);

    Ember.RSVP.all(promises).then((resolutions) => {
      const images = resolutions.map((resolution) => resolution.path ? resolution.path[0] : resolution);

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
    const imageId = preloader.idFor(keyframe, 'src');
    const image = preloader.getElement(imageId);

    return isPresent(image) ? new Ember.RSVP.resolve(image) : this._getImageAsElement(keyframe);
  }
});
