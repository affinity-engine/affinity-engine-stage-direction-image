import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('affinity-engine-stage-direction-image-canvas', 'Integration | Component | affinity engine stage direction image canvas', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{affinity-engine-stage-direction-image-canvas}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#affinity-engine-stage-direction-image-canvas}}
      template block text
    {{/affinity-engine-stage-direction-image-canvas}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
