import Ember from 'ember';
import layout from '../templates/components/affinity-engine-stage-direction-image';
import { classNames } from 'affinity-engine';
import { DirectableComponentMixin } from 'affinity-engine-stage';

const {
  Component,
  get
} = Ember;

const { computed: { reads, notEmpty } } = Ember;

export default Component.extend(DirectableComponentMixin, {
  layout,

  classNames: ['ae-stage-direction-image'],
  classNameBindings: ['customClassNames'],
  hook: 'affinity_engine_stage_direction_image',

  configuration: reads('direction.configuration'),
  animationLibrary: reads('configuration.animationLibrary'),
  caption: reads('configuration.caption'),
  height: reads('configuration.height'),
  layers: reads('configuration.layers'),
  renderMethod: reads('configuration.renderMethod'),
  transitions: reads('configuration.transitions'),
  onClick: reads('configuration.onClick'),

  customClassNames: classNames('configuration.classNames'),

  clickable: notEmpty('onClick'),

  actions: {
    clicked(event) {
      const onClick = get(this, 'onClick');

      if (onClick) onClick(event);
    }
  }
});
