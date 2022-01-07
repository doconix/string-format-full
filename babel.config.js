module.exports = {
    env: {
        legacy: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: ["IE 11"],
                        },
                    },
                ],
            ],
            plugins: [
                [
                    "@babel/transform-runtime",
                    {
                        "absoluteRuntime": false,
                        "corejs": false,
                        "helpers": true,
                        "regenerator": true,
                        "version": "7.0.0-beta.0"
                    }
                ]
            ],
        },
        modern: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: ["last 2 Chrome versions"],
                        },
                    },
                ],
            ],
            plugins: [
                [
                    "@babel/transform-runtime",
                    {
                        "absoluteRuntime": false,
                        "corejs": false,
                        "helpers": true,
                        "regenerator": true,
                        "version": "7.0.0-beta.0"
                    }
                ]
            ],
        }
    }
}
