const path = require('path');
//const TerserPlugin = require('terser-webpack-plugin');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const basePath = path.resolve(__dirname, '../');

const config = {
    // 入口文件
    entry: {
        index: [path.join(basePath, 'index')]
    },
    // 输出目录
    output: {
        filename: '[name].js',
        //chunkFilename: '[name].js',
        path: path.join(basePath, 'lib'),
        publicPath: '',
        library: 'threeBackground',
        libraryTarget: 'umd'
    },
    // 使用项目中的react，组件库本身则不额外打包react
    externals: {
        react: "commonjs react",
        "react-dom": "commonjs react-dom",
    },
    module: {
        rules: [
            // 处理TSX文件
            {
                test: /\.(tsx|d\.ts|ts)$/,
                // 排除node_modules目录
                exclude: /node_modules/,
                // 使用ts-loader和babel-loader
                use: [
                    { loader: 'ts-loader' }
                ]
            },
            // 处理CSS/LESS文件
            // {
            //     test: /\.css/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            // },
            // {
            //     test: /\.less$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
            // },
            // // 处理字体和图片文件
            // {
            //     test: /\.(ttf)(\?.+)?$/,
            //     type: 'asset/resource',
            //     generator: {
            //         filename: '[contenthash:12][ext]'
            //     }
            // }
        ]
    },
    // 插件数组
    plugins: [
        new CleanWebpackPlugin(),
        // 创建一个MiniCssExtractPlugin实例，用于提取CSS代码到单独的文件中
        // new MiniCssExtractPlugin({
        //     filename: '[name].css'
        // }),
    ],
    // 解析配置
    resolve: {
        // 扩展名数组，省略后缀名时按顺序查找
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        usedExports: true,
        sideEffects: true,
        // minimizer: [
        //     new OptimizeCSSAssetsPlugin({}),
        //     new TerserPlugin({
        //         // Safari 10的作用域BUG
        //         // @see https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/92
        //         terserOptions: {
        //             safari10: true,
        //             format: {
        //                 comments: false
        //             }
        //         },
        //         // 消除注释
        //         extractComments: false
        //     })
        // ]
    }
};

module.exports = config;
