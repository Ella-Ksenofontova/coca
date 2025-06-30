const path = require('path');
const fs = require("fs");
const webpack = require("webpack")
const times = require("lodash/times");
const matter = require("gray-matter");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require('template-ejs-loader');

function getFilesFromDir(dirPath) {
  const files = [];

  function traverseDir(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        traverseDir(fullPath); // Recursive call for subdirectories
      } else {
        files.push(fullPath);
      }
    }
  }

  traverseDir(dirPath);
  return files;
}

function getHTMLContent(file) {
  const fileData = fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return data;
  });

  return fileData;
}

function getFrontmatter(markdown) {
  try {
    const { data } = matter(markdown);
    return data;
  } catch (error) {
    console.error("Error parsing front matter:", error);
    return {};
  }
}

const posts = getFilesFromDir(path.join(__dirname, "src/pages/posts"));

const makeHtmlConfig = n => {
  return new HtmlWebpackPlugin({
    inject: true,
    filename: `/blog/${path.basename(posts[n])}`,
    cache: true,
    publicPath: "/",
    template: htmlWebpackPluginTemplateCustomizer({

      templatePath: 'index.ejs',

      templateEjsLoaderOption: {
        data: {
          ...getFrontmatter(getHTMLContent(posts[n])),
          content: getHTMLContent(path.join("src/pages/posts-content/", getFrontmatter(getHTMLContent(posts[n])).path_to_real_content))
        }
      }
    })
  })
};

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, "src/js", "handle-scroll.js"),
        to: path.resolve(__dirname, "/dist")
      }
      ]
    }),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, "src/js", "menu.js"),
        to: path.resolve(__dirname, "/dist")
      }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      publicPath: "/",
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'contacts.html'),
      filename: 'contacts.html',
      publicPath: "/",
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'pricing.html'),
      filename: 'pricing.html',
      publicPath: "/",
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'about.html'),
      filename: 'about.html',
      publicPath: "/",
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'blog.html'),
      filename: 'blog.html',
      publicPath: "/",
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', '404.html'),
      filename: '404.html',
      publicPath: "/",
      inject: true
    }),
    ...times(posts.length, makeHtmlConfig),
    new webpack.ProvidePlugin({
      _: "underscore"
    })],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", 'resolve-url-loader', "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.ejs$/i,
        use: ["html-loader", "template-ejs-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        dependency: { not: ['url'] },
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js',
    publicPath: "/",
    clean: true
  },
  watchOptions: {
    ignored: /node_modules/
  }
}