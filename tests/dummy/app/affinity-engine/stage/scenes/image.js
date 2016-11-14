import { Scene, step } from 'affinity-engine-stage';
import { task } from 'ember-concurrency';

export default Scene.extend({
  name: 'Image Direction Test',

  start: task(function * (script) {
  const diyz = yield script.image('diy').fadeIn();

  // yield step();
  diyz.state({ expression: 'embarrassed' });
    const classroom = script.image('classroom').classNames('foofoo');

    yield step();
    yield classroom.fadeIn();

    yield step();
    yield classroom.fadeOut();

    yield step();
    classroom.transition({ opacity: 0.2 });

    yield step();
    yield classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    yield step();
    const classroom2 = yield script.image('classroom').transition({ opacity: 0.8 });

    yield step();
    yield classroom2.transition({ opacity: 0.6 });

    yield step();
    const beach = yield script.image('beach');

    yield step();
    beach.keyframe('night');

    yield step();
    const diy = script.image('diy').fadeIn();

    yield step();
    diy.position('dummy1');

    yield step();
    diy.state({ expression: 'embarrassed' });

    yield step();
    diy.state({ expression: 'neutral' });
  })
});
