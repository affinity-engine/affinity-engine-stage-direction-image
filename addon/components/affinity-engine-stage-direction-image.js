import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  get,
  isPresent,
  set
} = Ember;

const { run: { next } } = Ember;
const { computed: { alias } } = Ember;

export default Component.extend(DirectableComponentMixin, {
  layout,

  classNames: ['ae-stage-direction-image-type'],
  classNameBindings: ['customClassNames'],
  hook: 'affinity_engine_stage_direction_image',

  animationLibrary: alias('directable.animationLibrary'),
  caption: alias('directable.caption'),
  customClassNames: alias('directable.customClassNames'),
  layers: alias('directable.layers'),
  transitions: alias('directable.transitions'),

  didRender() {
    next(() => {
      const height = get(this, 'directable.height');

      if (isPresent(height)) {
        set(this, 'height', this.$().height() * (height / 100));
      }
    });
  },

  actions: {
    compose(transition, resolve) {
      transition.layerChanges.forEach((change) => {
        change(resolve);
      });
    }
  }
});
