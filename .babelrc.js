module.exports = {
  plugins: [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-flow-strip-types"
  ],
  env: {
    lib: {
      plugins: ["@babel/plugin-proposal-class-properties"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: ["last 5 versions", "ie 9", "defaults"]
            }
          }
        ]
      ]
    },
    lib_server: {
      plugins: ["@babel/plugin-proposal-class-properties"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: 6
            }
          }
        ]
      ]
    },
    node8: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "8.0.0"
            },
            loose: true,
            modules: "commonjs"
          }
        ]
      ],
      plugins: [
        [
          "babel-plugin-replace-imports",
          {
            test: /react-relay-network-modern\/lib\//i,
            replacer: "react-relay-network-modern/node8/"
          }
        ]
      ]
    },
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current"
            }
          }
        ]
      ]
    }
  }
};
