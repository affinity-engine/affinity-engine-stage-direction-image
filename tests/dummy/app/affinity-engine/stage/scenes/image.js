import { Scene, step } from 'affinity-engine-stage';
import { task } from 'ember-concurrency';

export default Scene.extend({
  name: 'Image Direction Test',

  start: task(function * (script) {
    const classroom = script.image('classroom', { classNames: 'foofoo' });

    yield step();
    yield classroom.fadeIn();

    yield step();
    yield classroom.fadeOut();

    yield step();
    classroom.transition({ effect: { opacity: 0.2 } });

    yield step();
    yield classroom.transition({ effect: { opacity: 0.3 } }).transition({ effect: { opacity: 0.4 } }).transition({ effect: { opacity: 0.5 } });

    yield step();
    const classroom2 = yield script.image('classroom').transition({ effect: { opacity: 0.8 } });

    yield step();
    yield classroom2.transition({ effect: { opacity: 0.6 } });

    yield step();
    const beach = yield script.image('beach', { renderMethod: 'cover' }).fadeIn();

    yield step();
    beach.keyframe('night');

    yield step();
    const diy = script.image('diy', { onClick: () => window.console.log('foo') }).transition({ effect: { left: '50%' } }).fadeIn();

    yield step();
    diy.position('dummy1');

    yield step();
    diy.state({ expression: 'embarrassed' });

    yield step();
    diy.state({ expression: 'neutral' });
  })
});
