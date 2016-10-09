import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image-layer';
import { registrant } from 'affinity-engine';

const {
  Component,
  computed,
  get
} = Ember;

const { equal } = computed;

export default Component.extend({
  layout,

  classNames: ['ae-stage-direction-image-layer'],
  classNameBindings: ['isBase:ae-stage-direction-image-layer-base'],
  hook: 'affinity_engine_stage_direction_image_layer',

  preloader: registrant('affinity-engine/preloader'),

  isBase: equal('layer', 'base'),

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
  })
});
