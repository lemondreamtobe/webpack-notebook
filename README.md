# Webpack配置详解
#### 配置详解
```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // JavaScript 执行入口文件 string | string[] | obj
  // './demo1/main.js' ['./demo1/main.js'， './demo1/main2.js'] {demo:'./demo1/main.js', demo2:'./demo2/main.js'}
  // Webpack 会为每个生成的 Chunk 取一个名称，Chunk 的名称和 Entry 的配置有关：
  // 如果 entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main；
  // 如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称。
  entry: './demo1/main.js',

  // Webpack 在寻找相对路径的文件时会以 context 为根目录，context 默认为执行启动 Webpack 时所在的当前工作目录
  // context 必须是一个绝对路径的字符串
  // 因为 Entry 的路径和其依赖的模块的路径可能采用相对于 context 的路径来描述，context 会影响到这些相对路径所指向的真实文件
  context: path.resolve(__dirname, './demo1/dist'),

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
    crossOriginLoading: 'anonymous' | 'use-credentials',

    // 配置以何种方式导出库 
    // !! 需要搭配library一起使用
    // 不同方式影响webpack打包输出 和调用的方法
    // 默认值是var
    // 例子 输出var LibraryName = lib_code
    // 使用 LibraryName.doSomething();
    libraryTarget: 'var' | 'commonjs' | 'commonjs2' | 'this' | 'window' | 'global',

    // 配置导出库的名称
    // 不填它时，默认输出格式是匿名的立即执行函数
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
        include: path.resolve(__dirname, 'src'), // 也可以是路径数组

        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, 'node_modules'), // 也可以是路径数组 数组里的每项之间是或的关系，即文件路径符合数组中的任何一个条件就会被命中

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
    ],

    // 可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 
    // 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准
    // 使用正则表达式 也可以用返回boolean类型的函数 
    noParse: /jquery|chartjs/, // 也可以是数组

    // 因为 Webpack 是以模块化的 JavaScript 文件为入口，
    // 所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。 
    // parser 属性可以更细粒度的配置哪些模块语法要解析哪些不解析，和 noParse 配置项的区别在于 parser 可以精确到语法层面， 
    // 而 noParse 只能控制哪些文件不被解析
    parser: {
      amd: false, // 禁用 AMD
      commonjs: false, // 禁用 CommonJS
      system: false, // 禁用 SystemJS
      harmony: false, // 禁用 ES6 import/export
      requireInclude: false, // 禁用 require.include
      requireEnsure: false, // 禁用 require.ensure
      requireContext: false, // 禁用 require.context
      browserify: false, // 禁用 browserify
      requireJs: false, // 禁用 requirejs
    }
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },

  // 插件配置，webpack强大的插件机制
  plugins: [ // 数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    // 所有页面都会用到的公共代码提取到 common 代码块中
    // new CommonsChunkPlugin({
    //   name: 'common',
    //   chunks: ['a', 'b']
    // }),
  ],

  // webpack server配置
  devServer: {
    contentBase: path.join(__dirname, '/demo1'), // 告诉服务器从哪个目录中提供内容
    compress: true, // 一切服务都启用 gzip 压缩
    port: 9000,
    proxy: { // 代理到后端服务接口
      '/api': 'http://localhost:3000'
    },
    hot: true, // 启用 webpack 的 模块热替换 功能
    historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    overlay: { errors: true }, // 出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    publicPath: '/dist/', // 此路径下的打包文件可在浏览器中访问
    inline: true, // 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
    open: true, // 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页
    watch: true, // 监听文件更新 DevServer下自动打开 默认为false
    watchOptions: { // 更灵活的监听配置
      // 不监听的文件或文件夹，支持正则匹配
      // 默认为空
      ignored: /node_modules/,
      // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
      // 默认为 300ms  
      aggregateTimeout: 300,
      // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
      // 默认每隔1000毫秒询问一次
      poll: 1000
    },
    profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

    cache: false, // 是否启用缓存提升构建速度
  },

  // 配置 Webpack 如何寻找模块所对应的文件
  resolve: {
    alias: { // 通过别名来把原导入路径映射成一个新的导入路径
      '@/common': path.join(process.cwd(), 'demo1/common'),
    },

    // 有一些第三方模块会针对不同环境提供几分代码。 例如分别提供采用 ES5 和 ES6 的2份代码
    // 这也是为什么很多npm包有的pck.json 有main属性
    // 比如 {
    //   "jsnext:main": "es/index.js",// 采用 ES6 语法的代码入口文件
    //   "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
    // }
    // 会按照数组里的顺序去package.json 文件里寻找，只会使用找到的第一个
    // 假如你想优先采用 ES6 的那份代码，可以这样配置 ['jsnext:main', 'browser', 'main']
    mainFields: ['browser', 'main'], // 默认值，

    // 这个没啥好说的
    // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在
    // 例如下面这个 导入模块会优先寻找.ts结尾的文件 找不到就一直按照数组中的类型寻找
    // 找到就返回 最后还是找不到就报错
    extensions: ['.ts', '.js', '.json'],

    // 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 node_modules 目录下寻找
    // 例如项目中有很多大型的组件模块可以以下配置 带来很多的便利
    // 例如 import '../../../common/button' -> import 'button' 
    // 组件之类的个人感觉还是alias 设置里的方便 这个属性可以放一些资源之类
    modules: [path.join(process.cwd(), 'demo1/common'), 'node_modules'],

    // 配置描述第三方模块的文件名称，也就是 package.json 文件
    descriptionFiles: ['package.json'], // 默认值

    enforceExtension: false, // 默认值，配置为 true 所有导入语句都必须要带文件后缀

    // 只对 node_modules 下的模块生效。 enforceModuleExtension 通常搭配 enforceExtension 使用，
    // 在 enforceExtension:true 时，因为安装的第三方模块中大多数导入语句没带文件后缀， 
    // 所以这时通过配置 enforceModuleExtension:false 来兼容第三方模块
    enforceModuleExtension: false // 
  }

  /* 其他配置*/
  // 可以指定打包环境 个人理解是不同环境下打包的规则不同 不如node下的打包fs path模块不会打包
  target: 'web' | 'node' | 'async-node' | 'webworker' | 'electron-main' | 'electron-renderer',

  // 输出文件性能检查配置
  performance: { 
    hints: 'warning', // 有性能问题时输出警告
    hints: 'error', // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function(assetFilename) { // 过滤要检查的文件
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: 'source-map', // 默认值是 false 即不生成 Source Map，想为构建出的代码生成 Source Map 以方便调试

  // 通过 externals 可以告诉 Webpack JavaScript 运行环境已经内置了那些全局变量，
  // 针对这些全局变量不用打包进代码中而是直接使用全局变量
  externals: {
    // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
    jquery: 'jQuery'
  },

  // ResolveLoader 用来告诉 Webpack 如何去寻找 Loader，因为在使用 Loader 时是通过其包名称去引用的， Webpack 需要根据配置的 //////// Loader 包名去找到 Loader 的实际代码，以调用 Loader 去处理源文件
  // 个人感觉不常用到。需要用这个配置也只是加载本地loader 
  resolveLoader:{
    // 去哪个目录下寻找 Loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main']
  }
};
```