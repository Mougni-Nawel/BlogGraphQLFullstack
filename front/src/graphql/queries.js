import { gql } from '@apollo/client';

export const GETCOMMENTS = gql`
query getComments($postId: ID!) {
  getComments(postId: $postId) {
    id
    content
    userId
    postId
    username
  }
}
`;


export const GETPOST = gql`
query getPost($id: ID!) {
  getPost(id: $id) {
    id
    title
    content
    userId
    image
  }
}
`;
