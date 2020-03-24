import React from 'react'
import { rhythm } from '../utils/typography'
import { Link } from 'gatsby'
import get from 'lodash/get'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import '../utils/hash'

import Tag from './tag'
import hashCode from '../utils/hash'

const useStyles = makeStyles({
  wrapper: {
    margin: rhythm(1),
    boxShadow: '0 8px 18px rgba(0,0,0,.06)',
    '&:hover': {
      boxShadow: '0 8px 18px rgba(0,0,0,.2)',
    },
  },
  media: {
    height: 140,
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  actionArea: {
    color: 'var(--textLink)',
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  focusHighlight: {},
  title: {
    fontSize: 25,
    fontWeight: 500,
    paddingBottom: 8,
  },
  meta: {
    paddingTop: 0,
  },
  date: {
    marginRight: 10,
  },
  tag: {
    marginRight: 8,
    marginTop: -4,
  },
})

export default function ArticleDescription({ article, langKey }) {
  const classes = useStyles()
  const title = get(article, 'frontmatter.title') || article.id
  return (
    <Card className={classes.wrapper} key={article.id}>
      <Link to={`/article/${article.id}`}>
        <CardActionArea
          classes={{
            root: classes.actionArea,
            focusHighlight: classes.focusHighlight,
          }}
        >
          <CardMedia
            className={classes.media}
            image={`https://picsum.photos/seed/${hashCode(article.id)}/800/140`}
          />
          <CardContent>
            <Typography className={classes.title}>{title}</Typography>
            <Typography color="textSecondary" dangerouslySetInnerHTML={{
              __html: article.frontmatter.spoiler,
            }} />
          </CardContent>
        </CardActionArea>
        <CardContent className={classes.meta}>
          <Typography
            className={classes.date}
            variant="subtitle2"
            component="span"
          >
            {article.frontmatter.date}
          </Typography>
          {article.frontmatter.tags.split(',').map(t => (
            <Tag name={t} key={t}/>
          ))}
        </CardContent>
      </Link>
    </Card>
  )
}
