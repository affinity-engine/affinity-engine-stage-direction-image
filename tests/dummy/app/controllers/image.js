import Ember from 'ember';
import images from '../affinity-engine/fixtures/images';
import keyframes from '../affinity-engine/fixtures/keyframes';

const { Controller } = Ember;

export default Controller.extend({
  config: {
    component: {
      stage: {
        direction: {
          image: {
            attrs: {
              positions: {
                dummy1: {
                  margin: '10px'
                }
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
