export default [{
  id: 'classroom',
  keyframe: 'classroom'
}, {
  id: 'beach',
  height: 150,
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
  states: [{
    key: { pose: 'standing' },
    layers: {
      base: 'diy-base',
      nose: 'diy-default-nose',
      hair: 'diy-default-hair'
    }
  }, {
    key: { pose: 'standing', expression: 'embarrassed' },
    layers: {
      blush: 'diy-blush',
      lips: 'diy-embarrassed-lips',
      eyes: 'diy-embarrassed-eyes'
    }
  }, {
    key: { pose: 'standing', expression: 'neutral' },
    layers: {
      lips: 'diy-default-lips',
      eyes: 'diy-default-eyes'
    }
  }]
}];
