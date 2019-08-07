// Webpack uses this to work with directories
const path = require("path");
// Simplifies creation of HTML files (copy or generate from src to dist)
const webpack = require("webpack");
// Clean /dist folder before build
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// Copy static assets to /dist
const CopyWebpackPlugin = require("copy-webpack-plugin");
// Store, Hide, Expose, and Reference environment variables from .env file
const DotEnvWebpackPlugin = require("dotenv-webpack");
// Assemble html from partials
const HtmlWebpackPlugin = require("html-webpack-plugin");
// Extract CSS from bundle.js into its own file
const MiniCssExtractWebpackPlugin = require("mini-css-extract-plugin");
// Minimize CSS for production
const OptimizeCSSAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
// Minimize JS for production
const TerserJSWebpackPlugin = require("terser-webpack-plugin");

// configure webpack
module.exports = (env, argv) => {
  return {
    // Entry point: From this file webpack will begin its work
    entry: "./src/js/index.js",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      writeToDisk: true
    },
    // Webpack loaders
    module: {
      rules: [
        // Loader for .css/.scss files
        {
          test: /\.(s*)css$/,
          use: [
            {
              loader: MiniCssExtractWebpackPlugin.loader,
              options: {
                publicPath: "./"
              }
            },
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
        },
        // Loader for babel
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
        // // Loader for JSON data
        // {
        //   test: /\.json$/,
        //   loader: "json-loader"
        // }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserJSWebpackPlugin({}),
        new OptimizeCSSAssetsWebpackPlugin({})
      ]
    },
    plugins: [
      new DotEnvWebpackPlugin({
        systemvars: true
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "src/assets/locales/"),
          to: path.resolve(__dirname, "dist/assets/locales/")
        }
      ]),
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
      new MiniCssExtractWebpackPlugin({
        filename: "bundle.css"
      })
    ],

    // Webpack bundles all javascript into this file
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: argv.mode == "production" ? "../apps/VehicleDash/" : ""
    }
  };
};
