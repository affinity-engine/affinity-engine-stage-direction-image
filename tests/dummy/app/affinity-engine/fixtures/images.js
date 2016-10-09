export default [{
  id: 'classroom',
  layerOrder: ['base'],
  compositions: {
    default: {
      base: 'classroom'
    }
  }
}, {
  id: 'beach',
  layerOrder: ['base'],
  compositions: {
    default: {
      base: 'beach-day'
    },
    night: {
      base: 'beach-night'
    }
  }
}, {
  id: 'diy',
  height: 90,
  layerOrder: [
    'base',
    'blush',
    'lips',
    'nose',
    'eyes',
    'hair'
  ],
  compositions: {
    default: {
      base: 'diy-base',
      blush: null,
      lips: 'diy-default-lips',
      nose: 'diy-default-nose',
      eyes: 'diy-default-eyes',
      hair: 'diy-default-hair'
    },
    embarrassed: {
      blush: 'diy-blush',
      lips: 'diy-embarrassed-lips',
      eyes: 'diy-embarrassed-eyes'
    }
  }
}];
