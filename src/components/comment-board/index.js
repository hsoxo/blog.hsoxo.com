import React from "react"
import { Box, Button, Container, TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import CommentList from './comment-list'
import NewComment from './new-post'
import { getComments } from './api'
import OXOContext from './context'
import { SnackbarProvider } from 'notistack';

class OXOComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    this.refreshComments()
  }

  refreshComments() {
    getComments(this.props.id)
      .then(r =>{
        this.setState({
          comments: r.data.comments
        })
      })
      .catch(e => {
        console.error(e)
        this.setState({
          comments: []
        })
      })
  }

  render() {
    const { comments } = this.state
    console.log(comments)
    return (
      <SnackbarProvider maxSnack={3}>
        <OXOContext.Provider
          value={{
            comments: this.state.comments,
            postId: this.props.id,
            refresh: () => this.refreshComments()
          }}
        >
          <Container>
            <NewComment postId={this.props.id} />
            <CommentList comments={comments} offset={0}/>
          </Container>
        </OXOContext.Provider>
      </SnackbarProvider>
    )
  }

}

export default OXOComment
