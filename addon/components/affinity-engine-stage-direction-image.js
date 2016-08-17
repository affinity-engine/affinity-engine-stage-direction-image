import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import multiton from 'ember-multiton-service';
import { configurable, deepArrayConfigurable, registrant } from 'affinity-engine';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  computed,
  get
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
  preloader: registrant('affinity-engine/preloader'),

  animationAdapter: configurable(configurationTiers, 'animationLibrary'),
  caption: configurable(configurationTiers, 'caption'),
  imageCategory: configurable(configurationTiers, 'imageCategory'),
  src: configurable(configurationTiers, 'src'),
  transitions: deepArrayConfigurable(configurationTiers, 'directable.attrs.transitions'),

  imageElement: computed('directable.attrs.fixture.src', {
    get() {
      const preloader = get(this, 'preloader');

      if (get(preloader, 'isPlaceholder')) { return; }

      const fixture = get(this, 'directable.attrs.fixture');
      const imageId = preloader.idFor(fixture, 'src');

      return preloader.getElement(imageId);
    }
  })
});
