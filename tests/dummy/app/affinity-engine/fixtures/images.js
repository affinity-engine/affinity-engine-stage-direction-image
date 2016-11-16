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
    'lips',
    'eyes',
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
      keyframe: 'diy-blush'
    }],
    lips: [{
      state: { pose: 'standing', expression: 'neutral' },
      keyframe: 'diy-default-lips'
    }, {
      state: { pose: 'standing', expression: 'embarrassed' },
      keyframe: 'diy-embarrassed-lips'
    }],
    eyes: [{
      state: { pose: 'standing', expression: 'neutral' },
      keyframe: 'diy-default-eyes'
    }, {
      state: { pose: 'standing', expression: 'embarrassed' },
      keyframe: 'diy-embarrassed-eyes'
    }],
    nose: [{
      state: [{ pose: 'standing', expression: 'neutral' }, { pose: 'standing', expression: 'embarrassed' }],
      keyframe: 'diy-default-nose'
    }],
    hair: [{
      state: { pose: 'standing' },
      keyframe: 'diy-default-hair'
    }]
  }
}];
