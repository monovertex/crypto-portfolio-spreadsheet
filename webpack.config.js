const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const distPath = path.resolve('dist');

module.exports = (env = 'development') => {
    const isDevEnv = env === 'development';

    return {
        devtool: '',
        mode: isDevEnv ? 'development' : 'production',
        watch: false,
        entry: {
            app: ['./src/app.js'],
        },
        output: {
            path: distPath,
        },
        resolve: {
            alias: {
                'src': path.resolve(__dirname, 'src'),
                'node_modules': path.resolve(__dirname, 'node_modules'),
            },
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'eslint-loader' },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'babel-loader' },
                    ],
                },
            ],
        },
        plugins: [
            new GasPlugin(),
            new CleanWebpackPlugin([distPath]),
            new CopyWebpackPlugin([{ from: 'public' }]),
            new WebpackShellPlugin({ onBuildExit: ['yarn run deploy'] }),
        ],
    };
};
