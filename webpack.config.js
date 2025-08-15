const path = require('path');
const fs = require("fs");
const webpack = require("webpack")
const times = require("lodash/times");
const matter = require("gray-matter");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    const { data, content } = matter(markdown);
    return [data, content];
  } catch (error) {
    console.error("Error parsing front matter:", error);
    return [{}, {}];
  }
}

const posts = getFilesFromDir(path.join(__dirname, "src/pages/posts"));

const makeHtmlConfig = n => {
  const name = path.basename(posts[n], '.html');
  return new HtmlWebpackPlugin({
    inject: true,
    filename: `blog/${name}/index.html`,
    cache: true,
    publicPath: "/",
    chunks: ["index"],
    template: htmlWebpackPluginTemplateCustomizer({

      templatePath: 'index.ejs',

      templateEjsLoaderOption: {
        data: {
          ...getFrontmatter(getHTMLContent(posts[n]))[0],
          content: getFrontmatter(getHTMLContent(posts[n]))[1]
        }
      }
    })
  })
};

module.exports = {
  entry: {
    index: "./src/index.js",
    moveCarousel: "./src/js/move-carousel.js",
    accordions: "./src/js/accordions.js",
    countryChooser: "./src/js/country-chooser.js",
    carouselsHomepage: "./src/js/scroll-carousels.js",
    carouselsAbout: "./src/js/scroll-carousels-about.js",
    carouselsBlog: "./src/js/scroll-carousels-blog.js",
    switchPrice: "./src/js/switch-price.js",
    tooltipsAndDialogs: "./src/js/tooltips-and-dialogs.js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      publicPath: "/",
      inject: true,
      chunks: ["index", "carouselsHomepage"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'contacts.html'),
      filename: 'contacts/index.html',
      publicPath: "/",
      inject: true,
      chunks: ["index", "tooltipsAndDialogs", "countryChooser"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'pricing.html'),
      filename: 'pricing/index.html',
      publicPath: "/",
      inject: true,
      chunks: ["index", "accordions", "switchPrice"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'about.html'),
      filename: 'about/index.html',
      publicPath: "/",
      inject: true,
      chunks: ["index", "carouselsAbout"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', 'blog.html'),
      filename: 'blog/index.html',
      publicPath: "/",
      inject: true,
      chunks: ["index", "carouselsBlog"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/pages', '404.html'),
      filename: '404.html',
      publicPath: "/",
      inject: true,
      chunks: ["index"]
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
    filename: '[name].[contenthash].js',
    publicPath: "/",
    clean: true
  },
  watchOptions: {
    ignored: /node_modules/
  }
}