export default {
  priority: 3,
  default: {
    component: {
      stage: {
        direction: {
          image: {
            attrs: {
              layer: 'stage.image.foreground',
              renderMethod: 'figure',
              positions: {
                center: {
                  left: '50%',
                  translateX: '-50%'
                },
                centerLeft: {
                  left: '50%',
                  translateX: '-100%'
                },
                centerRight: {
                  left: '50%'
                },
                left: {
                  left: '25%',
                  translateX: '-50%'
                },
                right: {
                  left: '75%',
                  translateX: '-50%'
                },
                farLeft: {
                  left: '0%'
                },
                farRight: {
                  left: '100%',
                  translateX: '-100%'
                },
                offLeft: {
                  left: '0%',
                  translateX: '-100%'
                },
                offRight: {
                  left: '100%'
                },
                nudgeLeft: {
                  left: '-=5%'
                },
                nudgeRight: {
                  left: '+=5%'
                },
                bottom: {
                  bottom: 0
                },
                nudgeUp: {
                  bottom: '+=5%'
                },
                nudgeDown: {
                  bottom: '-=5%'
                },
                nudgeBack: {
                  translateZ: '-=2vh'
                },
                nudgeForward: {
                  translateZ: '+=2vh'
                }
              }
            }
          }
        },
        layer: {
          stage: {
            image: {
              foreground: {
                attrs: {
                  zIndex: 10
                }
              }
            }
          }
        }
      }
    }
  }
};
