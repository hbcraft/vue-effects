export default [
  {
    images: [
      {
        src: '/images/banner/01.png'
      }
    ],
    initial: {
      scale: 1,
      blur: 4
    },
    offset: {
      blur: 4
    },
    offsetCurve: {
      blur: [
        0,
        0,
        1,
        1
      ]
    }
  },
  {
    images: [
      {
        src: '/images/banner/02-0.png',
        duration: 5000
      },
      {
        src: '/images/banner/02-1.png',
        duration: 60
      },
      {
        src: '/images/banner/02-2.png',
        duration: 200
      },
      {
        src: '/images/banner/02-1.png',
        duration: 60
      }
    ],
    initial: {
      scale: 0.6,
      blur: 0
    },
    offset: {
      translate: [
        15,
        0
      ],
      blur: 10
    },
    offsetCurve: {
      blur: [
        0.3,
        0.7,
        0.5,
        0.5
      ]
    }
  },
  {
    images: [
      {
        src: '/images/banner/03.png'
      }
    ],
    initial: {
      scale: 1,
      translate: [
        -50,
        0
      ],
      blur: 1
    },
    offset: {
      translate: [
        30,
        0
      ],
      blur: -5
    },
    offsetCurve: {
      blur: [
        0.25,
        1,
        1,
        0
      ]
    }
  },
  {
    images: [
      {
        src: '/images/banner/04.png'
      }
    ],
    initial: {
      scale: 0.6,
      translate: [
        0,
        7
      ],
      blur: 4
    },
    offset: {
      translate: [
        60,
        0
      ],
      blur: -10
    },
    offsetCurve: {
      blur: [
        0.4,
        1,
        1,
        0
      ]
    }
  },
  {
    images: [
      {
        src: '/images/banner/05.png'
      }
    ],
    initial: {
      scale: 0.6,
      translate: [
        0,
        -3
      ],
      blur: 5
    },
    offset: {
      translate: [
        130,
        0
      ],
      blur: -10
    },
    offsetCurve: {
      blur: [
        0.5,
        1,
        1,
        0
      ]
    }
  },
  {
    images: [
      {
        src: '/images/banner/06.png'
      }
    ],
    initial: {
      scale: 0.65,
      blur: 6
    },
    offset: {
      translate: [
        150,
        0
      ],
      blur: -6
    },
    offsetCurve: {}
  }
]
