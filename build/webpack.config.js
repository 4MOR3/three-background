const path = require('path')
const srcDir = path.join(__dirname, "..", "src");
// webpack中所有配置信息都应该写在module.exports中
module.exports = {
    // 入口文件
    entry: path.join(srcDir, 'index.ts'),
    // 指定打包文件输出的路径
    output: {
        path: path.join(__dirname, '../dist'),
        // 打包后的文件
        filename: '[name].js',
    },
    // 指定webpack打包时使用的模块
    module: {
        // 指定要加载的规则
        rules: [
            {
                // 指定的是规则生效的文件
                test:/\.ts|tsx$ /,
                // 要使用的loader
                use: 'ts-loader',
                // 要排除的文件
                exclude: /node-modules/
            },
            
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
}
