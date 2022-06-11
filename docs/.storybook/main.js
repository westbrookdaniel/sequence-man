const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.{tsx,mdx}'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return {
      ...config,
      resolve: {
        alias: [
          {
            find: 'sequence-man',
            replacement: path.resolve(
              __dirname,
              '../../packages/sequence-man/'
            ),
          },
        ],
      },
    }
  },
}
