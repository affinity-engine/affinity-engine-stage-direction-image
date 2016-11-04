import Ember from 'ember';
import images from '../affinity-engine/fixtures/images';
import keyframes from '../affinity-engine/fixtures/keyframes';

const { Controller } = Ember;

export default Controller.extend({
  config: {
    global: {
      animationLibrary: 'velocity',
      transitions: Ember.A()
    },
    component: {
      stage: {
        direction: {
          image: {
            transition: {
              duration: 1000
            },
            positions: {
              dummy1: {
                margin: '10px'
              }
            }
          }
        }
      }
    }
  },
  fixtures: {
    images,
    keyframes
  }
});
