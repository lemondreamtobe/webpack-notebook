const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { WebPlugin } = require('web-webpack-plugin');

module.exports = {
  // JavaScript 执行入口文件 string | string[] | obj
  // './demo1/main.js' ['./demo1/main.js'， './demo1/main2.js'] {demo:'./demo1/main.js', demo2:'./demo2/main.js'}
  // Webpack 会为每个生成的 Chunk 取一个名称，Chunk 的名称和 Entry 的配置有关：
  // 如果 entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main；
  // 如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称。
  entry: './demo1/main.tsx',

  // Webpack 在寻找相对路径的文件时会以 context 为根目录，context 默认为执行启动 Webpack 时所在的当前工作目录
  // context 必须是一个绝对路径的字符串
  // 因为 Entry 的路径和其依赖的模块的路径可能采用相对于 context 的路径来描述，context 会影响到这些相对路径所指向的真实文件
  // context: path.resolve(__dirname, './demo1/dist'),

  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    // 配置输出文件的名称，为string 类型。 如果只有一个输出文件，则可以把它写成静态不变的
    // 但是在有多个 Chunk 要输出时，就需要借助模版和变量了。前面说到 Webpack 会为每个 Chunk取一个名称，可以根据 Chunk 的名称来区分输出的文件名
    // filename: '[name].js'
    // id	Chunk 的唯一标识，从0开始
    // name	Chunk 的名称
    // hash	Chunk 的唯一标识的 Hash 值
    // chunkhash	Chunk 内容的 Hash 值
    // 其中 hash 和 chunkhash 的长度是可指定的，[hash:8] 代表取8位 Hash 值，默认是20位
    // 例子 '[name].[contenthash].[id].js'
    filename: 'bundle.js',

    // 只用于指定在运行过程中生成的 Chunk 在输出时的文件名称
    // 配置无入口的 Chunk 在输出时的文件名称 
    // 常用于动态加载 使用CommonChunkPlugin 或者最明显的例子是loadable 内置变量和filename一样
    chunkFilename: '[name].[contenthash].js', 

    // 输出文件都放到 dist 目录下  配置输出文件存放在本地的目录，必须是 string 类型的绝对路径
    path: path.resolve(__dirname, './demo1/dist'),

    // 在复杂的项目里可能会有一些构建出的资源需要异步加载，加载这些异步资源需要对应的 URL 地址
    // 配置发布到线上资源的 URL 前缀，为string 类型。 默认值是空字符串 ''，即使用相对路径
    // 例如 filename:'[name]_[chunkhash:8].js'  publicPath: 'https://cdn.example.com/assets/'
    // 引入时就需要这样<script src='https://cdn.example.com/assets/a_12345678.js'></script>
    // output.path 和 output.publicPath 都支持字符串模版，内置变量只有一个：hash 代表一次编译操作的 Hash 值
    publicPath: 'https://cdn.example.com/assets/',

    /*
      Webpack 输出的部分代码块可能需要异步加载，而异步加载是通过 JSONP 方式实现的。 
      JSONP 的原理是动态地向 HTML 中插入一个 <script src="url"></script> 标签去加载异步资源。
      output.crossOriginLoading 则是用于配置这个异步插入的标签的 crossorigin 值。
      anonymous: (默认) 在加载此脚本资源时不会带上用户的 Cookies
      use-credentials: 在加载此脚本资源时会带上用户的 Cookies
      通常用设置 crossorigin 来获取异步加载的脚本执行时的详细错误信息
    */
    // crossOriginLoading: 'anonymous' | 'use-credentials',

    // 配置以何种方式导出库 
    // !! 需要搭配library一起使用
    // 不同方式影响webpack打包输出 和调用的方法
    // 默认值是var
    // 例子 输出var LibraryName = lib_code
    // 使用 LibraryName.doSomething();
    // libraryTarget: 'var' | 'commonjs' | 'commonjs2' | 'this' | 'window' | 'global',

    // 配置导出库的名称
    library: 'LibraryDemo',

    // 配置要导出的模块中哪些子模块需要被导出
    // output.libraryTarget 被设置成 commonjs 或者 commonjs2 时使用才有意义
    libraryExport: 'a'
  },

  // module 配置如何处理模块
  module: {
    // 配置模块的读取和解析规则，通常用来配置 Loader。其类型是一个数组，数组里每一项都描述了如何去处理部分文件
    rules: [
      {
        test: /\.css$/, // 条件匹配 也可以是正则数组

        // 只命中src目录里的css文件，加快 Webpack 搜索速度
        // include: path.resolve(__dirname, 'src'), // 也可以是路径数组

        // 排除 node_modules 目录下的文件
        // exclude: path.resolve(__dirname, 'node_modules'), // 也可以是路径数组 数组里的每项之间是或的关系，即文件路径符合数组中的任何一个条件就会被命中

        use: [ // 应用哪些loader
          MiniCssExtractPlugin.loader, // 一组 Loader 的执行顺序默认是从右到左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后
          {
            loader:'css-loader',
            options:{
              // minimize:true,
            }
          }
        ]
      },
      {
        // 对非文本文件采用 file-loader 加载
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.tsx$/,
        loader: 'awesome-typescript-loader'
      }
    ],

    // 可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 
    // 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准
    // 使用正则表达式 也可以用返回boolean类型的函数 
    noParse: /jquery|chartjs/,

    
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({}), new UglifyJsPlugin({
      parallel: false,
      uglifyOptions: {
        compress: {
          inline: false,
        },
        mangle: {
          // 处理移动端网页在iOS10上因为变量重复声明导致页面白屏的问题
          safari10: true,
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        },
      }
    })],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new WebPlugin({
      template: './demo1/template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production，以去除源码中只有开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, '/demo1'), // 告诉服务器从哪个目录中提供内容
    compress: true, // 一切服务都启用 gzip 压缩
    port: 9000,
    hot: true, // 启用 webpack 的 模块热替换 功能
    historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    overlay: { errors: true }, // 出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    publicPath: '/dist/', // 此路径下的打包文件可在浏览器中访问
    inline: true, // 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
    open: true
  },
  resolve: {
    alias: {
      '@/common': path.join(process.cwd(), 'demo1/common'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  }
};