---
title: Gatsby - GraphQL 使用本地 Markdown 生成页面
date: '2020-03-18'
spoiler: 在 Gatsby 项目中集成本地 Markdown
tags: Gatsby
---

使用 SSG 生成最多的站点类型应属个人博客了，当然本站现在也是使用 Gatsby 生成的，而博客类站点的文章使用最多的当属 Markdown 格式了，所以我们首先看看 Gatsby 是如何集成 Markdown 文件和查询 Markdown 文件信息。

## 读取和解析 Markdown 文件

Gatsby 官方提供了 `gatsby-transformer-remark` 插件，用来解析 Markdown 文件并合并到 GraphQL 的查询中。使用方法如下：

    module.exports = {
      ...
      plugins: [
        ...
        {
          // 读取 markdown 文件
          resolve: `gatsby-source-filesystem`,
          options: {
            name: `data`,
            path: `${__dirname}/path/to/markdowns`,
            ignore: [`**/\.*`], // ignore files starting with a dot
          },
        },
        {
          // 解析 markdown 文件
          resolve: `gatsby-transformer-remark`,
          options: {
            plugins: [
               ...
            ]
          },
        }
      ]
    }

加入配置后重新编译，回到 GraphQL Explorer 中，可以看到新增了 allMarkdownRemark 和 markdownRemark 两个根结点，默认会是以下的结构，

    query MarkdownQuery {
      allMarkdownRemark {
        nodes {
          # 文档的前 140 字的纯文本摘要 
          # 可选参数 pruneLength
          excerpt
          # 文档摘要的 HTML AST 树                
          excerptAst
          # 文档中的 Headers 和层级 (拍平的 Table of Content)              
          headings {
            depth
            value
          }
          # md 在本地的绝对路径
          fileAbsolutePath
          # md 的 Meta 信息 在各个 md 文档头位置定义 (解析：gray-matter)
          frontmatter {
            ...
          }
          # 文档的 HTML 文本
          html
          # 文档的 HTML AST 树
          htmlAst
          # 文档的纯 md 文本
          rawMarkdownBody
          # 根据文档 Header 生成的目录的 HTML 文本
          # 必要参数 pathToSlugField 
          # 可选参数 absolute, heading, maxDepth
          tableOfContents
          # 根据 md 长度计算的阅读时间
          timeToRead
        }
      }
    }

## 生成页面

在 GraphQL Explorer 中已经可以看到数据了，下一步就是生成相应的页面了，打开项目根目录下的 `gatsby-node.js` 文件，加入以下代码，

    // 导出 createPages API
    // doc: https://www.gatsbyjs.org/docs/node-apis/#createPages
    exports.createPages = ({ graphql, actions }) => {
      // 获取 createPage 函数
      const { createPage } = actions
      return new Promise((resolve, reject) => {
        // 导入 blogIndex 页面 JSX 模版
        const blogIndex = path.resolve('./src/templates/blog-list.js')
        // 创建 blogIndex 页面
        createPage({
          path: '/',
          component: blogIndex,
        })
    
        // 导入 blogIndex 页面 JSX 模版
        const blogPost = path.resolve('./src/templates/blog-post.js')
        // 查询所有的 md 文档
        graphql(`
          {
            allMds: allMarkdownRemark {
              mds: nodes {
                id
              }
            }
          }
        `).then(r => {
          for (const md of r.data.allMds.mds) {
            // 对所有的 md 文档生成一个在 /article/${md.id} 的页面
            createPage({
              path: `/article/${md.id}`,
              component: blogPost,
              // context 可以用于向 JSX 模版中的 GraphQL 传餐
              // 此处的 id 对应 blog-post.js 中 graphql 中的 $id
              context: {
                id: md.id,
              },
            })
          }
        })
        resolve()
      })
    }

这段代码的作用是在 Gatsby 编译的时候，告诉 Gatsby 使用那些模版，用什么样的模版参数生成静态页面。比如示例代码中的 `blog-list.js` 和 `blog-post.js` 两个模版，其中 `blog-list.js` 代码如下所示，在创建生成时，Gatsby 会先执行 JSX 底部的 GraphQL 会执行并把结果储存到 `BlogIndexTemplate` 的 `props.data` 中，然后再交由 React 生成页面。

    import React from 'react'
    import { Link, graphql } from 'gatsby'
    
    import Layout from '../components/layout'
    import get from 'lodash/get'
    
    class BlogIndexTemplate extends React.Component {
      render() {
        const siteTitle = get(this, 'props.data.site.siteMetadata.title')
        const posts = get(this, 'props.data.allMarkdownRemark.nodes')
    
        return (
          <Layout>
            <div>
              {posts.map(node => (
                <Link to={`/article/${node.id}`}>
                  {node.frontmatter.title}
                </Link>
              ))}
            </div>
          </Layout>
        )
      }
    }
    
    export default BlogIndexTemplate
    
    export const pageQuery = graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          nodes {
            id
            frontmatter {
              title
            }
          }
        }
      }
    `

`blog-post.js` 的情况与 `blog-index.js` 略有不同的地方在于，GraphQL 中的 `($id: String!)`，这表示这个 GraphQL 需要一个 `$id` 参数才能正确执行，而这个参数只有在 `gatsby-node.js` 中使用 `createPage` 的 `context` 参数才可以传递，也就是在上一篇

中提到的非页面组件，只能使用 StaticQuery，不能传递参数。

    import React from 'react'
    import { graphql } from 'gatsby'
    import Layout from '../components/layout'
    
    function BlogPostTemplate({ data }) {
      const post = data.md
      let html = post.html
    
      return (
        <Layout>
          <div>{post.meta.title}</div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Layout>
      )
    }
    
    export default BlogPostTemplate
    
    export const pageQuery = graphql`
      query BlogPostBySlug($id: String!) {
        md: markdownRemark(id: { eq: $id }) {
          html
          meta: frontmatter {
            title
          }
        }
      }
    `

## 给 Markdown Node 添加更多属性

有时我们需要对所有的 Markdown 文件生成更多的属性，比如说在上面的例子中，使用了 GraphQL 对 Markdown 文件自动生成的 id 作为页面地址，但有时我们想要使用更复杂或者更有意义的方式去生成页面地址，而这个地址要在很多地方被使用，比如说 `BlogIndex` 和 `BlogPage` 或者在文章中加入上一篇或者下一篇的链接，都需要获得页面地址。当然我们可以使用一个 utils function 获得一个 Markdown 的 Node 然后生成链接，但是这样做会在页面打包的 js 文件中多打包一个函数，虽然一个函数不会很大，但是同时页面静态化的时候也会将需要传给这个函数的所有参数和数据全部打包进入页面数据中然后到客户端执行，这些数据事实上和页面并没有太多关系，而且这种做法违背了 SSG 追求极致速度的初衷。正确的姿势是这样的，还是打开 `gatsby-node.js`，添加以下代码

    // 使用 Gatsby 提供的 onCreateNode API
    // doc: https://www.gatsbyjs.org/docs/node-apis/#onCreateNode
    // 这个 API 会在一个新的 GraphQL Node 创建的时候调用
    exports.onCreateNode = ({ node, getNode, actions }) => {
      // 获取 createNodeField 函数
      const { createNodeField } = actions
      // 如果是 MarkdownRemark 类型的 Node
      if (node.internal.type === `MarkdownRemark`) {
        // 获得父级节点的相对路径
        const fileNodePath = getNode(node.parent).relativePath
        const slug = fileNodePath[0]
        // 在节点的 Field 属性中创建名为 slug 的属性，值是 md 所在文件夹的名称
        createNodeField({
          node,
          name: `slug`,
          value: slug,
        })
      }
    }

由于修改了 GraphQL 的 Schema 需要重新构建才能看到效果。重新构建后，在 GraphQL Explorer 中，我们可以看到在 `allMarkdownRemark.nodes` 和 `markdownRemark` 中的 `field` 属性中多了一个 `slug` 属性可以查询。现在我们可以直接使用下面的查询来查询到新增的属性值了，cheers🍺～

    query MarkdownQuery {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
        }
      }
    }

## 常用插件

Gatsby 官方和一些第三方提供了一些基于 `gatsby-transformer-remark` 的有趣的插件，一般以 `gatsby-remark` 开头，

### `gatsby-remark-images`

[gatsby-remark-images](https://www.gatsbyjs.org/packages/gatsby-remark-images/)

对 Markdown 文档中的图片文件提供支持，融合了 `gatsby-plugin-sharp` 提供的自动压缩图片，生成图片缩略图，生成展位图片的吊炸天的功能。

### `gatsby-remark-prismjs`

[gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/)

包装 PrismJS，提供 Markdown 中代码块的高亮支持。

### `gatsby-remark-external-links`

[gatsby-remark-external-links](https://www.gatsbyjs.org/packages/gatsby-remark-external-links/)

 对 Markdown 中的外部链接提供更好的支持。