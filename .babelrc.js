module.exports = {
  "presets": [
    ["next/babel", {
      "preset-env": {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": {
          "browsers": [
            "last 2 Chrome versions",
            "last 2 Edge versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "ie 11"
          ],
        }
      }
    }]
  ],
}
