import React from "react"
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography,
  IconButton, Button, Divider, Grid } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles'
import NewComment from './new-post'
import { set, get } from 'idb-keyval'
import { likeComments, unlikeComments } from './api'
import OXOContext from './context'
import { useSnackbar } from 'notistack';
const awaitWrapper = require('./await-wrapper')

const useStyles = makeStyles(theme => ({
  buttons: {
    float: 'right',
    height: 50,
  },
  avatar: {
    marginTop: 15,
  },
  commentHeader: {
    margin: '5px 0 0 10px',
    fontSize: 'small',

  },
  commentName: {

  },
  commentContent: {
    margin: '0 0 0 10px',
    fontSize: 'large',
  },
  commentActions: {
    margin: '0 0 10px 2px',
    fontSize: 'large',
  },
  commentDivider: {
    height: 20,
    width: 2,
  },
  commentButton: {
    minWidth: 30,
    padding: '0 4px',
    fontSize: 'small'
  },
  commentButtonActive: {
    color: 'var(--textLink)',
    minWidth: 30,
    padding: '0 4px',
    fontSize: 'small'
  },
  new: {
    marginTop: 10
  }
}))

const offsetValue = 30

const CommentItem = ({comment, offset}) => {
  const classes = useStyles()
  const likeKey = `like-${comment.uuid}`
  const [state, setState] = React.useState({
    showNew: false,
    liked: null,
  });
  const { enqueueSnackbar } = useSnackbar();

  if (state.liked === null) {
    (async function() {
      const liked = await get(likeKey)
      setState({
        liked: Boolean(liked)
      })
    })()
  }

  const handleLike = async function(context) {
    if (state.liked) {
      const [err, data] = await awaitWrapper(likeComments({
        postId: context.postId,
        commentUuid: comment.uuid,
      }))
      if (err) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center', }
        })
        return
      }
      set(likeKey, 0)
      comment.likes = comment.likes - 1
      setState({
        liked: 0
      })
    } else {
      const [err, data] = await awaitWrapper(unlikeComments({
        postId: context.postId,
        commentUuid: comment.uuid,
      }))
      if (err) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center', }
        })
        return
      }
      set(likeKey, 1)
      comment.likes = comment.likes + 1
      setState({
        liked: 1
      })
    }
  }

  const handleShowNew = function() {
    setState({
      showNew: !state.showNew
    })
  }
  return (
    <OXOContext.Consumer>
      {context => (
        <ListItem alignItems="flex-start" style={{marginLeft: offset * offsetValue, width: `calc(100% - ${offset * offsetValue}px)`}}>
          <ListItemAvatar className={classes.avatar}>
            <Avatar
              alt={comment.userId || '匿名用户'}
              src={`https://www.gravatar.com/avatar/${comment.avatar}`}/>
          </ListItemAvatar>
          <Grid container>
            <Grid item xs={12} className={classes.commentHeader}>
              <div>{comment.userId || '匿名用户'}</div>
            </Grid>
            <Grid item xs={12} className={classes.commentContent}>
              <div>{comment.text}</div>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" className={classes.commentActions}>
                {state.liked
                  ?
                  <Button className={classes.commentButtonActive} onClick={() => handleLike(context)}>
                    {comment.likes}<FavoriteIcon fontSize="inherit" />
                  </Button>
                  :
                  <Button className={classes.commentButton} onClick={() => handleLike(context)}>
                    {comment.likes || ''}<FavoriteBorderIcon fontSize="inherit" />
                  </Button>
                }
                <Divider orientation="vertical" className={classes.commentDivider}/>
                <Button className={classes.commentButton} onClick={handleShowNew}>
                  {state.showNew ? '收起' : '回复'}
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {state.showNew
                ? <div className={classes.new}>
                    <NewComment targetId={comment.uuid} handleShow={handleShowNew}/>
                  </div>
                : <div/>}
            </Grid>
          </Grid>
        </ListItem>)}
    </OXOContext.Consumer>
  )
}

export default CommentItem
