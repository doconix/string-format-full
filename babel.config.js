module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        "targets": "defaults",
      }
    ],
  ],
  "plugins": ["transform-class-properties"]
}
