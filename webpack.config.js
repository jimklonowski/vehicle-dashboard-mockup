// Webpack uses this to work with directories
const path = require("path");
// Simplifies creation of HTML files (copy or generate from src to dist)
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Extract CSS from bundle.js into its own file
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Minimize CSS for production
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// Minimize JS for production
const TerserJSPlugin = require("terser-webpack-plugin");

// configure webpack
module.exports = {
  // Entry point: From this file webpack will begin its work
  entry: "./src/js/index.js",
  // Overriding default mode.  When set to production, webpack minifies and optimizes output
  // mode: "development",
  // Webpack loaders
  module: {
    rules: [
      // Loader for .css/.scss files
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      // Loader for .html files
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          interpolate: true,
          minimize: false
        }
      },
      // Loader for font files
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: "file-loader?name=fonts/[name].[ext]"
      },
      // Loader for image files
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "./assets"
        }
      }
    ]
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    //new webpack.SourceMapDevToolPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      favicon: "./src/assets/images/favicon.ico",
      inject: "head",
      minify: true
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ],

  // Webpack bundles all javascript into this file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  }
};