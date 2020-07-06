module.exports = {
  title: 'XState Docs',
  base: '/docs/',
  description:
    'Documentation for XState: State Machines and Statecharts for the Modern Web',
  markdown: {
    toc: { includeLevel: [2, 3] }
  },
  locales: {
    '/': {
      lang: 'en-US',
      title: 'XState Docs',
      description:
        'Documentation for XState: State Machines and Statecharts for the Modern Web'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'XState 文档',
      description: 'XState文档：用状态机和状态图构建现代web'
    }
  },
  themeConfig: {
    repo: 'davidkpiano/xstate',
    docsDir: 'docs',
    editLinks: true,
    logo: '/logo.svg',
    algolia: {
      apiKey: 'ddd397151aad9f0662ca36e5b39fed61',
      indexName: 'xstatejs'
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        lastUpdated: 'Last Updated',
        nav: [
          { text: 'API', link: 'https://xstate.js.org/api' },
          { text: 'Visualizer', link: 'https://xstate.js.org/viz' },
          { text: 'Chat', link: 'https://gitter.im/statecharts/statecharts' },
          { text: 'Community', link: 'https://spectrum.chat/statecharts' }
        ],
        sidebar: [
          {
            title: 'About',
            children: [
              '/about/concepts',
              '/about/goals',
              '/about/showcase',
              '/about/tutorials'
            ]
          },
          {
            title: 'Guides',
            children: [
              '/guides/start',
              '/guides/installation',
              '/guides/machines',
              '/guides/states',
              '/guides/statenodes',
              '/guides/events',
              '/guides/transitions',
              '/guides/hierarchical',
              '/guides/parallel',
              '/guides/effects',
              '/guides/actions',
              '/guides/guards',
              '/guides/context',
              '/guides/activities',
              '/guides/communication',
              '/guides/actors',
              '/guides/delays',
              '/guides/final',
              '/guides/history',
              '/guides/ids',
              '/guides/interpretation',
              '/guides/typescript'
            ]
          },
          {
            title: 'Tutorials',
            children: [
              '/tutorials/reddit',
              {
                title: '7GUIs',
                children: [
                  '/tutorials/7guis/counter',
                  '/tutorials/7guis/temperature',
                  '/tutorials/7guis/flight',
                  '/tutorials/7guis/timer'
                ]
              }
            ]
          },
          {
            title: 'Recipes',
            children: [
              '/recipes/react',
              '/recipes/vue',
              '/recipes/rxjs',
              '/recipes/ember'
            ]
          },
          {
            title: 'Packages',
            children: [
              'packages/xstate-react/',
              'packages/xstate-vue/',
              'packages/xstate-graph/',
              'packages/xstate-fsm/',
              'packages/xstate-test/',
              'packages/xstate-immer/'
            ]
          },
          {
            title: 'Patterns',
            children: ['/patterns/sequence']
          },
          {
            title: 'Examples',
            children: [
              '/examples/counter',
              '/examples/todomvc',
              '/examples/calculator'
            ]
          }
        ]
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        lastUpdated: '上次编辑时间',
        nav: [
          { text: 'API', link: 'https://xstate.js.org/api' },
          { text: '可视化状态图', link: 'https://xstate.js.org/viz' },
          { text: '讨论区', link: 'https://gitter.im/statecharts/statecharts' },
          { text: '社区', link: 'https://spectrum.chat/statecharts' }
        ],
        sidebar: [
          {
            title: '简介',
            children: [
              '/zh/about/concepts',
              '/zh/about/goals',
              '/zh/about/showcase',
              '/zh/about/tutorials'
            ]
          },
          {
            title: '指南',
            children: [
              '/zh/guides/start',
              '/zh/guides/installation',
              '/zh/guides/machines',
              '/zh/guides/states',
              '/zh/guides/statenodes'
              // '/guides/events',
              // '/guides/transitions',
              // '/guides/hierarchical',
              // '/guides/parallel',
              // '/guides/effects',
              // '/guides/actions',
              // '/guides/guards',
              // '/guides/context',
              // '/guides/activities',
              // '/guides/communication',
              // '/guides/actors',
              // '/guides/delays',
              // '/guides/final',
              // '/guides/history',
              // '/guides/ids',
              // '/guides/interpretation',
              // '/guides/typescript'
            ]
          }
          // {
          //   title: 'Tutorials',
          //   children: [
          //     '/tutorials/reddit',
          //     {
          //       title: '7GUIs',
          //       children: [
          //         '/tutorials/7guis/counter',
          //         '/tutorials/7guis/temperature',
          //         '/tutorials/7guis/flight',
          //         '/tutorials/7guis/timer'
          //       ]
          //     }
          //   ]
          // },
          // {
          //   title: 'Recipes',
          //   children: [
          //     '/recipes/react',
          //     '/recipes/vue',
          //     '/recipes/rxjs',
          //     '/recipes/ember'
          //   ]
          // },
          // {
          //   title: 'Packages',
          //   children: [
          //     'packages/xstate-react/',
          //     'packages/xstate-vue/',
          //     'packages/xstate-graph/',
          //     'packages/xstate-fsm/',
          //     'packages/xstate-test/',
          //     'packages/xstate-immer/'
          //   ]
          // },
          // {
          //   title: 'Patterns',
          //   children: ['/patterns/sequence']
          // },
          // {
          //   title: 'Examples',
          //   children: [
          //     '/examples/counter',
          //     '/examples/todomvc',
          //     '/examples/calculator'
          //   ]
          // }
        ]
      }
    }
  },
  plugins: [
    ['@vuepress/google-analytics', { ga: 'UA-129726387-1' }],
    'vuepress-plugin-export'
  ]
};
