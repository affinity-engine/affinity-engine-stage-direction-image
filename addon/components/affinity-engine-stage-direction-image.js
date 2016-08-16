import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import multiton from 'ember-multiton-service';
import { configurable, deepArrayConfigurable, registrant } from 'affinity-engine';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  computed,
  get,
  observer
} = Ember;

const configurationTiers = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.component.stage.direction.image',
  'config.attrs.component.stage',
  'config.attrs'
];

export default Component.extend(DirectableComponentMixin, {
  layout,

  classNames: ['ae-stage-direction-image-container'],
  hook: 'affinity_engine_stage_direction_image',

  config: multiton('affinity-engine/config', 'engineId'),
  translator: registrant('affinity-engine/translator'),

  animationAdapter: configurable(configurationTiers, 'animationLibrary'),
  caption: configurable(configurationTiers, 'caption'),
  imageCategory: configurable(configurationTiers, 'imageCategory'),
  imageElement: configurable(configurationTiers, 'imageElement'),
  src: configurable(configurationTiers, 'src'),
  transitions: deepArrayConfigurable(configurationTiers, 'directable.attrs.transitions'),

  didInsertElement(...args) {
    this._super(...args);

    const captionTranslation = get(this, 'captionTranslation');
    const image = get(this, 'image');
    const $image = this.$(image).clone();

    $image.addClass('ae-stage-direction-image');
    $image.attr('alt', captionTranslation);

    this.$('.ember-animation-box-active-instance .ae-image-container').append($image);
  },

  captionTranslation: computed('directable.attrs.fixture.id', 'caption', 'imageCategory', {
    get() {
      const caption = get(this, 'caption.key') || get(this, 'caption');
      const key = caption || `${get(this, 'imageCategory')}.${get(this, 'directable.attrs.fixture.id')}`;

      return get(this, 'translator').translate(key, get(this, 'caption.options')) || caption;
    }
  }).readOnly(),

  image: computed({
    get() {
      return get(this, 'imageElement') || `<img src="${get(this, 'src')}">`;
    }
  }).readOnly(),

  changeCaption: observer('captionTranslation', function() {
    const caption = get(this, 'captionTranslation');

    this.$('img').attr('alt', caption);
  })
});
