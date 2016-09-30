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

  animationLibrary: alias('directable.animationLibrary'),
  caption: alias('directable.caption'),
  customClassNames: alias('directable.customClassNames'),
  height: alias('directable.height'),
  keyframe: alias('directable.keyframe'),
  transitions: alias('directable.transitions'),

  src: computed('keyframe.src', 'directable.src', {
    get() {
      const preloader = get(this, 'preloader');

      if (get(preloader, 'isPlaceholder')) { return get(this, 'directable.src'); }

      const keyframe = get(this, 'keyframe');
      const imageId = preloader.idFor(keyframe, 'src');
      const blob = preloader.getElement(imageId, true);
      const urlCreator = window.URL || window.webkitURL;

      return blob ? urlCreator.createObjectURL(blob) : get(this, 'directable.src');
    }
  })
});
