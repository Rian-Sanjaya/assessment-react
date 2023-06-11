module.exports = function override(config, env) {
  config.module.rules[1].oneOf.splice(2, 0, {
    test: /\.less$/i,
    exclude: /\.module\.(less)$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    ],
  })

  return config
}

// module.exports = {
//   webpack: function (config, env) {
//     return config;
//   },
//   jest: function (config) {
//     return config;
//   },
//   devServer: function (configFunction) {
//     return function (proxy, allowedHost) {
//       const config = configFunction(proxy, allowedHost);
//       return config;
//     };
//   },
//   paths: function (paths, env) {
//     return paths;
//   },
// }