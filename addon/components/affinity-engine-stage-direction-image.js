import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  set
} = Ember;

const { computed: { alias } } = Ember;
const { run: { later } } = Ember;

export default Component.extend(DirectableComponentMixin, {
  layout,

  classNames: ['ae-stage-direction-image'],
  classNameBindings: ['customClassNames'],
  hook: 'affinity_engine_stage_direction_image',

  animationLibrary: alias('directable.animationLibrary'),
  caption: alias('directable.caption'),
  customClassNames: alias('directable.customClassNames'),
  height: alias('directable.height'),
  layers: alias('directable.layers'),
  renderMethod: alias('directable.renderMethod'),
  transitions: alias('directable.transitions'),

  actions: {
    compose(transition, resolve) {
      set(this, 'layers', transition.layers);

      later(resolve, transition.duration);
    }
  }
});
