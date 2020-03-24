import { Link, navigate, graphql } from 'gatsby'

import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'
import get from 'lodash/get'
import ArticleDescription from '../components/article-description'
import { Pagination } from '@material-ui/lab'

class BlogIndexTemplate extends React.Component {
  onPaginationChange(event, value) {
    navigate(value === 1 ? '/' : `/${value}`)
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={"Home"}/>
        <aside>{/*<Bio />*/}</aside>
        <main>
          {posts.map(({ node }) => (
            <ArticleDescription key={node.id} article={node} />
          ))}
        </main>
        <div style={{
          margin: 'auto',
          display: 'flex',
          position: 'relative',
          justifyContent: 'center',}}>
          <Pagination
            count={this.props.pageContext.totalPages}
            page={this.props.pageContext.currentPage}
            onChange={this.onPaginationChange.bind(this)}
          />
        </div>
      </Layout>
    )
  }
}

export default BlogIndexTemplate

export const pageQuery = graphql`
  query BlogList($ids: [String]) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(filter: {id: {in: $ids}}, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          timeToRead
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            spoiler
            tags
          }
        }
      }
    }
  }
`
