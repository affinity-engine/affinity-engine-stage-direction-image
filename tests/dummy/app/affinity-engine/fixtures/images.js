export default [{
  id: 'classroom',
  defaultIdentifiers: 'classroom',
  layerOrder: ['base'],
  layers: {
    base: [{
      id: 'classroom',
      keyframe: 'classroom'
    }]
  }
}, {
  id: 'beach',
  defaultIdentifiers: 'day',
  layerOrder: ['base'],
  layers: {
    base: [{
      id: 'day',
      keyframe: 'beach-day'
    }, {
      id: 'night',
      keyframe: 'beach-night'
    }]
  }
}, {
  id: 'diy',
  height: 90,
  defaultIdentifiers: { pose: 'standing', expression: 'neutral' },
  layerOrder: [
    'base',
    'blush',
    'lips',
    'nose',
    'eyes',
    'hair'
  ],
  layers: {
    base: [{
      id: { pose: 'standing' },
      keyframe: 'diy-base'
    }],
    blush: [{
      id: { pose: 'standing', expression: 'embarrassed' },
      keyframe: 'diy-blush'
    }],
    lips: [{
      id: { pose: 'standing', expression: 'neutral' },
      keyframe: 'diy-default-lips'
    }, {
      id: { pose: 'standing', expression: 'embarrassed' },
      keyframe: 'diy-embarrassed-lips'
    }],
    nose: [{
      id: { pose: 'standing' },
      keyframe: 'diy-default-nose'
    }],
    eyes: [{
      id: { pose: 'standing', expression: 'neutral' },
      keyframe: 'diy-default-eyes'
    }, {
      id: { pose: 'standing', expression: 'embarrassed' },
      keyframe: 'diy-embarrassed-eyes'
    }],
    hair: [{
      id: { pose: 'standing' },
      keyframe: 'diy-default-hair'
    }]
  }
}];
