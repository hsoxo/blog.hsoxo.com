import React from 'react'
import { graphql } from 'gatsby'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { makeStyles } from '@material-ui/core/styles'
import { rhythm } from '../utils/typography'
import { Box, Card, CardContent, CardHeader } from '@material-ui/core'
import Tag from '../components/tag'
import OXOComment from '../components/comment-board'
import Button from '@material-ui/core/Button'
import tagColor from '../components/tag-colors'


const useStyles = makeStyles({
  wrapper: {
    marginBottom: 50,
    borderRadius: 10,
    boxShadow: '0 8px 18px rgba(0,0,0,.06)',
    '&:hover': {
      boxShadow: '0 8px 18px rgba(0,0,0,.2)',
    },
  },
  header: {
    paddingLeft: rhythm(1),
    marginTop: 'calc(100vw / 11)',
    marginLeft: -20,
    marginBottom: 10,
  },
  body: {
    paddingLeft: rhythm(1),
    paddingRight: rhythm(1),
    paddingBottom: rhythm(1)
  },
  title: {
    color: 'var(--textTitle)',
    marginBottom: 20,
  },
  date: {
    backgroundColor: 'var(--bg)',
    color: 'var(--textNormal)',
    borderRadius: 8,
    marginRight: 10,
    padding: '0 6px',
    marginTop: -2,
    textTransform: 'none',
  },
  divider: {
    margin: 20,
  },
  bannerImgContainer: {
    width: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: -3,
    padding: 0
  },
  bannerImg: {
    minWidth: '100%',
    margin: 0,
    boxShadow: '0 8px 18px rgba(0,0,0,.2)',
  },
  commentArea: {
    backgroundColor: 'var(--bg-secondary)',
    paddingTop: 40,
  }
})

function BlogPostTemplate({ data }) {
  const post = data.md
  const classes = useStyles()

  // Replace original links with translated when available.
  let html = post.html

  return (
    <Layout title={post.meta.title}>
      <SEO title={post.meta.title}/>
      <Box className={classes.bannerImgContainer}>
        <img className={classes.bannerImg} src={`https://picsum.photos/seed/${post.meta.title}/1980/500`}/>
      </Box>
      <Box className={classes.header}>
        <Button
          className={classes.date}
          size="small"
        >
          {post.meta.date}
        </Button>
        {post.meta.tags.split(',').map(t => (
          <Tag name={t} key={t}/>
        ))}
      </Box>
      <Card className={classes.wrapper}>
        <CardContent className={classes.body}>
          <Typography variant="h4" className={classes.title}>
            {post.meta.title}
          </Typography>
          <Typography component="div" dangerouslySetInnerHTML={{ __html: post.toc }} />
          {/*<p*/}
          {/*  style={{*/}
          {/*    ...scale(-1 / 5),*/}
          {/*    display: 'block',*/}
          {/*    marginBottom: rhythm(1),*/}
          {/*    marginTop: rhythm(-4 / 5),*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {formatPostDate(post.frontmatter.date, lang)}*/}
          {/*  {` • ${formatReadingTime(post.timeToRead)}`}*/}
          {/*</p>*/}
          <Divider className={classes.divider} variant="middle" />
          <Typography component="div" className={"blog-post-wrapper"} dangerouslySetInnerHTML={{ __html: html }} />
        </CardContent>
        <CardContent className={classes.commentArea}>
          <OXOComment id={post.id}/>
        </CardContent>
      </Card>
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
        date(formatString: "MMMM DD, YYYY")
        tags
      }
      toc: tableOfContents(maxDepth: 3, pathToSlugField: "id", absolute: false)
    }
  }
`
