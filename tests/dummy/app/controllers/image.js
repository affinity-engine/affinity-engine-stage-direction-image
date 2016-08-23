import Ember from 'ember';
import images from '../affinity-engine/fixtures/images';
import keyframes from '../affinity-engine/fixtures/keyframes';

const { Controller } = Ember;

export default Controller.extend({
  config: {
    animationLibrary: 'velocity',
    transition: {
      effect: { opacity: 0.1 },
      duration: 100
    },
    component: {
      stage: {
        direction: {
          image: {
            transition: {
              duration: 1000
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
