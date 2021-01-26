module.exports = function override(config, env) {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules[/\\](?!react-native-gifted-chat|react-native-lightbox|react-native-parsed-text|react-native-typing-animation)/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-env', { useBuiltIns: 'usage' }],
            '@babel/preset-react'
          ],
          plugins: [
            "@babel/plugin-syntax-jsx",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-react-jsx",
            "@babel/plugin-transform-react-display-name"
          ],
        },
      },
    })
  
    return config
  }