export default ({ assetPrefix = '', webpack, ...config } = {}) => ({
  ...config,
  assetPrefix,
  webpack(webpackConfig, { dev }) {
    let localIdentName, imageName;
    if (dev) {
      localIdentName = '[name]__[local]--[hash:base64:5]';
      imageName = '[name]';
    } else {
      localIdentName = null;
      imageName = '[name]-[hash]';
    }

    const rule = webpackConfig.module.rules.find(rule => (
      rule.loader === 'babel-loader' &&
      rule.test && rule.test.toString() === '/\\.js(\\?[^?]*)?$/'
    ));
    if (rule && !rule.options.babelrc) {
      rule.options.presets.push(require.resolve('../babel/preset'));
    }
    webpackConfig.module.rules.push(
      {
        test: [
          /\.(css|s(a|c)ss)$/,
          /\.(bmp|gif|jpe?g|png)$/,
        ],
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.mod(ule)?\.css$/,
        use: [
          'babel-loader',
          'styled-modules/loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName,
              modules: true,
              sourceMap: dev,
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.mod(ule)?\.s(a|c)ss$/,
        use: [
          'babel-loader',
          'styled-modules/loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName,
              modules: true,
              sourceMap: dev,
              importLoaders: 2,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.mod(ule)?\.css$/,
        use: [
          'babel-loader',
          'styled-modules/loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName,
              sourceMap: dev,
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.mod(ule)?\.s(a|c)ss$/,
        use: [
          'babel-loader',
          'styled-modules/loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName,
              sourceMap: dev,
              importLoaders: 2,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(bmp|gif|jpe?g|png|ttf|eot|woff2?|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `dist/static/[path]${imageName}.[ext]`,
          publicPath: url => `${assetPrefix}/_soya/${url.replace('dist/static/', '')}`,
        },
      },
    );

    if (webpack) {
      webpack(webpackConfig, { dev });
    }

    return webpackConfig;
  },
});