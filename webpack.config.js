// 引入路径模块
const path = require("path");

module.exports = {
	// 从哪里开始编译
	entry: "./index.ts",
	// 编译到哪里
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	// 配置模块规则
	module: {
		rules: [
			{
				test: /\.tsx?$/, // .ts或者tsx后缀的文件，就是typescript文件
				use: "ts-loader", // 就是上面安装的ts-loader
				exclude: "/node-modules/", // 排除node-modules目录
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
		],
	},
	resolve: {
		extensions: [".ts"], // 配置ts文件可以作为模块加载
	},
	// 模式
	mode: "development",
};
