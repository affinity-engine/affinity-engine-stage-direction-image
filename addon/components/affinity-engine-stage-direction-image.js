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

  classNames: ['ae-stage-direction-image-type'],
  classNameBindings: ['customClassNames'],
  hook: 'affinity_engine_stage_direction_image',

  preloader: registrant('affinity-engine/preloader'),

  animationAdapter: alias('directable.animationAdapter'),
  caption: alias('directable.caption'),
  customClassNames: alias('directable.customClassNames'),
  keyframe: alias('directable.keyframe'),
  transitions: alias('directable.transitions'),

  src: computed('keyframe.src', 'directable.src', {
    get() {
      const preloader = get(this, 'preloader');

      if (get(preloader, 'isPlaceholder')) { return; }

      const keyframe = get(this, 'keyframe');
      const imageId = preloader.idFor(keyframe, 'src');

      return preloader.getElement(imageId, true) || get(this, 'directable.src');
    }
  })
});
