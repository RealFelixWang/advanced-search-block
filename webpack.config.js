const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(__dirname, 'src', 'index.tsx'),
        frontend: path.resolve(__dirname, 'src', 'frontend.tsx'),
        edit: path.resolve(__dirname, 'src', 'block.tsx'),
        'style-index': path.resolve(__dirname, 'src', 'style.scss'),
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript'
                            ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        ...defaultConfig.resolve,
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@wordpress/i18n': ['wp', 'i18n'],
        '@wordpress/blocks': ['wp', 'blocks'],
        '@wordpress/block-editor': ['wp', 'blockEditor'],
        '@wordpress/components': ['wp', 'components'],
        '@wordpress/data': ['wp', 'data'],
        '@wordpress/element': ['wp', 'element'],
        '@wordpress/api-fetch': ['wp', 'apiFetch']
    }
};