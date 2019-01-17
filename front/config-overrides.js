/*****
to fix Cannot read property 'imports' of undefined (window.Quill.imports ) in quill-image-resize-module
refer to :
1 https://github.com/kensnyder/quill-image-resize-module/pull/38/files
2 https://github.com/kensnyder/quill-image-resize-module/issues/7
3 https://github.com/kensnyder/quill-image-resize-module/issues/56
*****/
// todotodo 这个不需要了，还有 react-app-rewired
var webpack = require('webpack');

module.exports = function override(config, env) {
  // config.plugins = (config.plugins || []).concat(
  //   new webpack.ProvidePlugin({
  //     'window.Quill': 'quill/dist/quill.js',
  //     Quill: 'quill/dist/quill.js'
  //   })
  // );
  return config;
};

// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new webpack.ProvidePlugin({
//         'window.Quill': 'quill'
//         // Quill: 'quill/dist/quill.js'
//       })
//     ]
//   }
// };
