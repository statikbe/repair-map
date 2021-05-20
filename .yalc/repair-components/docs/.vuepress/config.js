const path = require('path');

module.exports = {
  title: 'Repair Components',
  description: 'Vue components for Repair projects',
  base: '/repair-components/',

  head: [
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;0,900;1,400&display=swap',
      },
    ],
  ],

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Repair Components',
      description: 'Vue components for Repair projects',
    },
  },

  themeConfig: {
    repoLabel: 'BitBucket',
    repo: 'https://bitbucket.org/statikbe/repair-components',
    docsDir: 'docs',
    editLinks: true,
    docsBranch: 'master',
    editLinkText: 'Edit this page',
    search: true,
    // locales: {
    //   '/': {
    //     label: 'English',
    //     selectText: 'Languages',
    //     lastUpdated: 'Last Updated',
    //     serviceWorker: {
    //       updatePopup: {
    //         message: 'New content is available.',
    //         buttonText: 'Refresh',
    //       },
    //     },
    sidebar: [
      {
        title: 'Installation',
        children: ['/pages/Installation/Vue', '/pages/Installation/Tailwind'],
      },
      {
        title: 'Styling',
        children: ['/pages/Styling/Typography'],
      },
      {
        title: 'Components',
        children: [
          '/pages/Components/App',
          '/pages/Components/Button',
          {
            title: 'Form',
            children: [
              '/pages/Components/Form/Form',
              '/pages/Components/Form/FormField',
              '/pages/Components/Form/FormText',
              '/pages/Components/Form/FormLocation',
            ],
          },
          '/pages/Components/Section',
        ],
      },
    ],
    //   },
    // },
  },

  alias: {
    styles: path.resolve(__dirname, '../../src/assets/css'),
  },

  postcss: {
    plugins: [require('tailwindcss')('./tailwind.config.js'), require('autoprefixer')],
  },
};
