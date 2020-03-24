import React from "react"
import { Grid, TextField, FormControlLabel, Checkbox,
  Paper, IconButton, Divider, InputBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send';
import { newComments } from './api'
import OXOContext from './context'
// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/index.css'
import { useSnackbar } from 'notistack';
const awaitWrapper = require('./await-wrapper')

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
  },
  textRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  paperOverride: {
    boxShadow: '0 2px 10px rgba(0,0,0,.06)',
  },
  claim: {
    color: 'var(--textFootnote)',
    fontSize: 'small',
    marginTop: -23,
    marginLeft: 5,
  }
}))

const NewComment = ({targetId, handleShow}) => {
  const [state, setState] = React.useState({
    anonymously: false,
    targetId,
    text: '',
    user: '',
    email: '',
    editorState: null,
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckboxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleTextfieldChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const handleValidation = async () => {
    if (!state.text) {
      return Promise.reject(new Error('请输入评论内容'))
    }
    if (!state.anonymously) {
      if (!state.user && !state.email) {
        return Promise.reject(new Error('请输入昵称和Email或选择匿名评论'))
      }
      if (!state.user) {
        return Promise.reject(new Error('请输入昵称或选择匿名评论'))
      }
      if (!state.email) {
        return Promise.reject(new Error('请输入Email或选择匿名评论'))
      }
    }
  }

  const handleSubmit = async (context) => {
    const [validErr, validData] = await awaitWrapper(handleValidation())
    if (validErr) {
      enqueueSnackbar(validErr.message, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center', }
      })
      return
    }
    const [e, data] = await awaitWrapper(newComments({
      postId: context.postId,
      text: state.text,
      replyTo: targetId,
      userId: state.user,
      email: state.email,
    }))
    if (e) {
      let msg = e.message
      if (e.message === 'user already has an email') {
        msg = '此昵称已绑定其他邮箱'
      } else if (e.message === 'email has already taken') {
        msg = '此邮箱被其他昵称绑定'
      }
      enqueueSnackbar(msg, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center', }
      })
      return
    }
    context.refresh()
    setState({
      anonymously: false,
      targetId,
      text: '',
      user: '',
      email: '',
    })
    if (handleShow) {
      handleShow()
    }
  }

  const classes = useStyles()
  return (
    <OXOContext.Consumer>
      {context => (
        <div>
          <Paper component="form" className={classes.paperOverride} elevation={2}>
            <Grid container className={classes.root}>
              <Grid item xs={12}>
                <div className={classes.textRoot}>
                  <InputBase
                    className={classes.input}
                    value={state.text || ''}
                    placeholder="加入讨论"
                    name="text"
                    onChange={handleTextfieldChange}
                    multiline
                  />
                  {/*<BraftEditor*/}
                  {/*  value={state.editorState}*/}
                  {/*/>*/}
                  <Divider className={classes.divider} orientation="vertical"/>
                  <IconButton
                    color="primary"
                    className={classes.iconButton}
                    onClick={() => {
                      handleSubmit(context)
                    }}
                  >
                    <SendIcon/>
                  </IconButton>
                </div>
                <Divider/>
              </Grid>
              <Grid item xs={12} sm={state.anonymously ? 12 : 4}>
                <FormControlLabel
                  control={<Checkbox
                    checked={state.anonymously}
                    onChange={handleCheckboxChange}
                    name="anonymously"
                  />}
                  style={{ margin: '5px 0 0 5px' }}
                  label="匿名评论"
                />
              </Grid>
              {
                state.anonymously
                  ? <div/>
                  : <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="name"
                        name="user"
                        value={state.user}
                        fullWidth
                        label="昵称 (仅用于显示)"
                        size="small"
                        onChange={handleTextfieldChange}
                        style={{ marginLeft: 10, paddingRight: 20 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id="email"
                        name="email"
                        value={state.email}
                        fullWidth
                        label="Email (我们会通知您新的动态)"
                        size="small"
                        onChange={handleTextfieldChange}
                        style={{ marginLeft: 10, paddingRight: 20 }}
                      />
                    </Grid>
                  </>
              }
            </Grid>
          </Paper>
          <div className={classes.claim}>
            * 我们不会泄露您的邮箱，我们会使用您在 Gravatar 网站使用的头像
          </div>
        </div>
      )}
    </OXOContext.Consumer>
  )
}

export default NewComment
