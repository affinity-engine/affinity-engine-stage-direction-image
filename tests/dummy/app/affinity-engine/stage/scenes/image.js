import { Scene, step } from 'affinity-engine-stage';

export default Scene.extend({
  name: 'Image Direction Test',

  start: async function(script) {
    const classroom = script.image('classroom');

    await step();
    classroom.transition({ opacity: 0.2 });

    await step();
    await classroom.transition({ opacity: 0.3 }).transition({ opacity: 0.4 }).transition({ opacity: 0.5 });

    await step();
    classroom.caption('foo');

    await step();
    const classroom2 = await script.image('classroom').transition({ opacity: 0.8 });

    await step();
    await classroom2.transition({ opacity: 0.6 });

    await step();
    await script.image('beach-day');

    await step();
    await script.image({
      id: 'beach-night',
      caption: 'beach during the night',
      src: 'affinity-engine/images/beach-night.jpg'
    });
  }
});
