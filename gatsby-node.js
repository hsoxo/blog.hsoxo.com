/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')
const _chuck = require('lodash/chunk')
const _reduce = require('lodash/reduce')
const _countBy = require('lodash/countBy')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    const blogIndex = path.resolve('./src/templates/blog-list.js')
    const blogArchives = path.resolve('./src/templates/blog-archives.js')
    const blogTags = path.resolve('./src/templates/blog-tags.js')
    const blogTagArchives = path.resolve('./src/templates/blog-tag-archives.js')
    createPage({
      path: `/archives`,
      component: blogArchives,
    })

    graphql(`
      {
        allMds: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          mds: nodes {
            id
            meta: frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              tags
            }
          }
        }
      }
    `).then(r => {
      const articlesPerPage = 5
      const posts = r.data.allMds.mds

      _chuck(posts, articlesPerPage).forEach((chuck, index) => {
        createPage({
          path: `/${index ? index + 1 : ''}`,
          component: blogIndex,
          context: {
            ids: chuck.map(x => x.id),
            currentPage: index + 1,
            totalPages: Math.ceil(posts.length / articlesPerPage),
          }
        })
      })

      let tags = _reduce(posts, (res, cur) => {
        res = [...res, ...cur.meta.tags.split(',').map(x => x.replace(' ', ''))]
        return res
      }, [])
      tags = _countBy(tags, String)

      createPage({
        path: `/tags`,
        component: blogTags,
        context: {
          tags: Object.entries(tags)
            .map(([key, value]) => ({ text: key, value }))
        }
      })
      Object.keys(tags).map(tag => {
        createPage({
          path: `/tag/${tag.toLowerCase()}`,
          component: blogTagArchives,
          context: {
            tag: `/${tag}/`
          }
        })
      })

      for (const md of posts) {
        createPage({
          path: `/article/${md.id}`,
          component: blogPost,
          context: {
            id: md.id,
          },
        })
      }
    })
    resolve()
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const fileNodePath = getNode(node.parent).relativePath.split('/')
    const langKey = fileNodePath[1].split('.')[1]
    createNodeField({
      node,
      name: `langKey`,
      value: langKey,
    })
  }
}
