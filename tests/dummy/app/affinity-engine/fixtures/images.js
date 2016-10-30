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
    'lipsAndEyes',
    'nose',
    'hair'
  ],
  layers: {
    base: [{
      id: { pose: 'standing' },
      keyframe: 'diy-base'
    }],
    blush: [{
      id: { pose: 'standing', expression: 'embarrassed' },
      keyframes: 'diy-blush'
    }],
    lipsAndEyes: [{
      id: { pose: 'standing', expression: 'neutral' },
      keyframes: ['diy-default-lips', 'diy-default-eyes']
    }, {
      id: { pose: 'standing', expression: 'embarrassed' },
      keyframes: ['diy-embarrassed-lips', 'diy-embarrassed-eyes']
    }],
    nose: [{
      id: [{ pose: 'standing', expression: 'neutral' }, { pose: 'standing', expression: 'embarrassed' }],
      keyframes: 'diy-default-nose'
    }],
    hair: [{
      id: { pose: 'standing' },
      keyframes: 'diy-default-hair'
    }]
  }
}];
