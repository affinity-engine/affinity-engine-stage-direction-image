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

    const fixture = this._findFixture(fixtureOrId);

    set(this, 'attrs.imageCategory', 'images');
    set(this, 'attrs.fixture', fixture);

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

    transitions.push(merge({ duration }, options));

    return this;
  },

  transition(effect, duration, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', []);

    transitions.push(merge({ duration, effect }, options));

    return this;
  },

  frame(fixtureOrId, options = {}) {
    this._entryPoint();

    const transitions = get(this, 'attrs.transitions') || set(this, 'attrs.transitions', []);
    const fixture = this._findFixture(fixtureOrId);

    transitions.push(merge({ fixture, in: { } }, options));

    return this;
  },

  _findFixture(fixtureOrId) {
    return  typeOf(fixtureOrId) === 'object' ? fixtureOrId : get(this, 'fixtureStore').find('images', fixtureOrId);
  }
});
