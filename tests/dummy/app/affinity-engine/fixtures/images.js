export default [{
  id: 'classroom',
  keyframe: 'classroom'
}, {
  id: 'beach',
  keyframes: [{
    default: true,
    id: 'day',
    keyframe: 'beach-day'
  }, {
    id: 'night',
    keyframe: 'beach-night'
  }]
}, {
  id: 'diy',
  height: 90,
  defaultState: { pose: 'standing', expression: 'neutral' },
  layerOrder: [
    'base',
    'blush',
    'lipsAndEyes',
    'nose',
    'hair'
  ],
  layers: {
    base: [{
      state: { pose: 'standing' },
      keyframe: 'diy-base'
    }],
    blush: [{
      state: { pose: 'standing', expression: 'embarrassed' },
      keyframes: 'diy-blush'
    }],
    lipsAndEyes: [{
      state: { pose: 'standing', expression: 'neutral' },
      keyframes: ['diy-default-lips', 'diy-default-eyes']
    }, {
      state: { pose: 'standing', expression: 'embarrassed' },
      keyframes: ['diy-embarrassed-lips', 'diy-embarrassed-eyes']
    }],
    nose: [{
      state: [{ pose: 'standing', expression: 'neutral' }, { pose: 'standing', expression: 'embarrassed' }],
      keyframes: 'diy-default-nose'
    }],
    hair: [{
      state: { pose: 'standing' },
      keyframes: 'diy-default-hair'
    }]
  }
}];
