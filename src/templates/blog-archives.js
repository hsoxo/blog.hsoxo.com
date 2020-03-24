import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import React from 'react'
import SEO from '../components/seo'
import { groupBy, get } from 'lodash'
import { List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core'
import { string } from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { rhythm } from '../utils/typography'

const useStyles = makeStyles({
  wrapper: {
    padding: rhythm(1),
    boxShadow: '0 8px 18px rgba(0,0,0,.06)',
    '&:hover': {
      boxShadow: '0 8px 18px rgba(0,0,0,.2)',
    },
  },
  year: {
    color: 'var(--header)',
  },
  listItem: {
    borderLeft: '2px solid #555555',
    marginLeft: 30,
  },
  listDate: {
    display: 'inline-block',
    width: '150px',
    fontWeight: 'bold'
  },

})

function BlogIndexTemplate({ data })  {
  const classes = useStyles()
  const posts = get(data, 'allMarkdownRemark.nodes')
  posts.forEach(x => {
    x.year = x.meta.date.split(', ')[1]
    x.date = x.meta.date.split(', ')[0]
  })
  const postsByYear = groupBy(posts, 'year')
  return (
    <Layout title={"Achieves"}>
      <SEO title={"Achieves"}/>
      <Paper className={classes.wrapper} elevation={3}>
        {Object.entries(postsByYear).map(([key, value]) => (
          <div key={key}>
            <Typography className={classes.year} variant="h4">
              {key}
            </Typography>
            <List>
              {value.map(post => (
                <Link key={post.id} to={`/article/${post.id}`}>
                  <ListItem className={classes.listItem} button>
                    <ListItemText>
                      <Typography className={classes.listDate} component="div">
                        {post.date}
                      </Typography>
                      {post.meta.title}
                    </ListItemText>
                  </ListItem>
                </Link>
              ))}
            </List>
          </div>
        ))}
      </Paper>
    </Layout>
  )
}

export default BlogIndexTemplate

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        id
        meta: frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
      }
    }
  }
`
