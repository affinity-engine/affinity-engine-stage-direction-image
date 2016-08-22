import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import { registrant } from 'affinity-engine';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  computed,
  get
} = Ember;

const { alias } = computed;

export default Component.extend(DirectableComponentMixin, {
  layout,

  classNames: ['ae-stage-direction-image-container'],
  hook: 'affinity_engine_stage_direction_image',

  preloader: registrant('affinity-engine/preloader'),

  animationAdapter: alias('directable.animationAdapter'),
  caption: alias('directable.caption'),
  fixture: alias('directable.fixture'),
  imageCategory: alias('directable.imageCategory'),
  src: alias('directable.src'),
  transitions: alias('directable.transitions'),

  imageElement: computed('fixture.src', {
    get() {
      const preloader = get(this, 'preloader');

      if (get(preloader, 'isPlaceholder')) { return; }

      const fixture = get(this, 'fixture');
      const imageId = preloader.idFor(fixture, 'src');

      return preloader.getElement(imageId);
    }
  })
});
