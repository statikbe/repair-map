const defaultTheme = require('tailwindcss/defaultTheme');
const defaultColors = require('tailwindcss/colors');

const colors = {
  ...defaultColors,
  primary: {
    DEFAULT: '#71b8c5',
    dark: '#5A939D',
    contrast: 'white',
  },
  secondary: {
    DEFAULT: '#9C7A97',
    dark: '#7C6178',
    contrast: 'white',
  },
  info: defaultColors.yellow[500],
  success: defaultColors.green[500],
  warning: defaultColors.blue[500],
  error: defaultColors.red[500],
};

module.exports = {
  purge: {
    options: {
      whitelistPatterns: [/^multiselect(.*)/],
    },
  },
  darkMode: false,
  theme: {
    borderWidth: {
      default: '1px',
      1: '1px',
      2: '2px',
      0: '0',
      4: '4px',
    },
    borderColor: colors,
    container: {
      center: true,
      padding: defaultTheme.spacing['4'],
    },
    fontFamily: {
      base: ['Titillium Web', 'sans-serif'],
    },
    fontSize: {
      base: ['18px', '25px'],
      tiny: ['14px', '20px'],
      small: ['16px', '24px'],
      large: ['20px', '30px'],
      huge: ['24px', '32px'],
      intro: ['20px', '30px'],
      h1: ['40px', '50px'],
      h2: ['35px', '40px'],
      h3: ['28px', '35px'],
      h4: ['22px', '25px'],
      h5: ['20px', '25px'],
      h6: ['18px', '25px'],
      button: ['18px', 1],
    },
    screens: {
      xs: '480px',
      sm: '660px',
      md: '820px',
      lg: '980px',
      xl: '1200px',
    },
    colors,
    // aspectRatio: {
    //   'none': 0,
    //   'square': [1, 1],
    //   '16/9': [16, 9],
    //   '4/3': [4, 3],
    //   '21/9': [21, 9],
    // },
    // extend: {
    //   maxWidth: {
    //     flyout: '280px',
    //     modal: '50vw',
    //     logo: '150px',
    //   },
    //   zIndex: {
    //     99: '99',
    //     100: '100',
    //     999: '999',
    //   },
    //   boxShadow: {
    //     card: '0 0 30px 0 rgba(0,0,0,0.15)',
    //     focus: '0 0 0 3px rgba(238,71,55,0.5)',
    //   },
    //   inset: {
    //     '1/2': '50%',
    //   },
    // },
  },
  // variants: {
  //   extend: {},
  // },
  plugins: [require('./tailwind/plugins/typography'), require('@tailwindcss/aspect-ratio')],
};
