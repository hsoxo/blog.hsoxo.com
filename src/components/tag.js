import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import tagColor from './tag-colors'

const useStyles = makeStyles({
  tag: {
    marginRight: 8,
    marginTop: -2,
    padding: '0 6px',
    borderRadius: 8,
    textTransform: 'none',
    color: '#ffffff',
  },
})



function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const Tag = ({ name }) => {
  const classes = useStyles()
  return (
    <Button
      className={classes.tag}
      style={{
        backgroundColor: tagColor[name.replace(/^\s+|\s+$/g, '').toLowerCase()] || getRandomColor(),
      }}
      size="small"
    >
      {name}
    </Button>
  )
}

export default Tag
