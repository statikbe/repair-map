const plugin = require('tailwindcss/plugin');

// We can't use @apply in index.css since we would have to prepend the prefix (which could be anything)
//

module.exports = plugin(function ({ addComponents, theme }) {
  //  Extend 'text-h#' classes with shared heading styles

  const sharedHeadingStyles = {
    'all': 'initial', // Make sure inherited styles from parent application get reset
    'display': 'block',
    'fontFamily': theme('fontFamily.base'),
    'fontWeight': 900,
    'color': theme('colors.primary.DEFAULT'),
    'marginTop': '0.75em',
    'marginBottom': '0.5em',
    '&:first-child': {
      marginTop: 0,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  };

  addComponents({
    '.text-h1': sharedHeadingStyles,
    '.text-h2': sharedHeadingStyles,
    '.text-h3': sharedHeadingStyles,
    '.text-h4': sharedHeadingStyles,
    '.text-h5': sharedHeadingStyles,
    '.text-h6': sharedHeadingStyles,
  });
});
