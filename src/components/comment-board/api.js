import requests from './requests'

export function getComments(postId) {
  return requests({
    url: '/api/comment/getAll',
    method: 'POST',
    data: {
      postId
    }
  })
}


export function newComments(data) {
  return requests({
    url: '/api/comment/create',
    method: 'POST',
    data
  })
}

export function likeComments(data) {
  return requests({
    url: '/api/comment/like',
    method: 'POST',
    data
  })
}

export function unlikeComments(data) {
  return requests({
    url: '/api/comment/unlike',
    method: 'POST',
    data
  })
}