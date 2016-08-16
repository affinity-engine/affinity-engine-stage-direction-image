import Ember from 'ember';
import multiton from 'ember-multiton-service';
import { registrant } from 'affinity-engine';
import { Direction } from 'affinity-engine-stage';

const {
  get,
  merge,
  set,
  typeOf
} = Ember;

export default Direction.extend({
  componentPath: 'affinity-engine-stage-direction-image',
  layer: 'engine.stage.foreground.image',

  fixtureStore: multiton('affinity-engine/fixture-store', 'engineId'),
  preloader: registrant('affinity-engine/preloader'),

  _setup(fixtureOrId) {
    this._entryPoint();

    const fixtureStore = get(this, 'fixtureStore');
    const fixture = typeOf(fixtureOrId) === 'object' ? fixtureOrId : fixtureStore.find('images', fixtureOrId);
    const id = get(fixture, 'id');
    const preloader = get(this, 'preloader');

    if (!get(preloader, 'isPlaceholder')) {
      const imageId = preloader.idFor(fixture, 'src');
      const imageElement = preloader.getElement(imageId);

      set(fixture, 'imageElement', imageElement);
    }

    set(this, 'attrs.fixture', fixture);
    set(this, 'attrs.imageCategory', 'images');
    set(this, 'id', id);

    return this;
  },

  _reset() {
    const fixture = get(this, 'attrs.fixture');

    return this._super({ fixture, transitions: Ember.A() });
  },

  caption(caption) {
    this._entryPoint();

    set(this, 'attrs.caption', caption);

    return this;
  },

  delay(duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', []);

    transitions.pushObject(merge({ duration }, options));

    return this;
  },

  transition(effect, duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', []);

    transitions.pushObject(merge({ duration, effect }, options));

    return this;
  }
});
