import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  get,
  set
} = Ember;

const { computed: { alias, notEmpty } } = Ember;
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
  onClick: alias('directable.onClick'),

  clickable: notEmpty('onClick'),

  actions: {
    clicked(event) {
      const onClick = get(this, 'onClick');

      if (onClick) onClick(event);
    }
  }
});
