import React from "react"
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography,
  IconButton, Button, Divider, Grid } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { makeStyles } from '@material-ui/core/styles'
import CommentItem from './comment-item'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
}))


const CommentList = ({comments, offset}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {comments.map(x => (
        <div key={x.uuid}>
          <CommentItem comment={x} offset={offset}/>
          <CommentList comments={x.children} offset={offset + 1}/>
        </div>))}
    </div>
  )
}

export default CommentList
