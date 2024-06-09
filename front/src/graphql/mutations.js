import { gql } from '@apollo/client';

export const LOGIN = `
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    id
    username
    email
    token
    success
  }
}
`;

export const SAVEUSER = gql`
mutation saveUser($username: String!, $email: String!, $password: String!) {
  saveUser(username: $username, email: $email, password: $password) {
    id
    username
    email
    success
  }
}
`;

export const SAVECOMMENT = gql`
mutation saveComment($content: String!, $userId: ID!, $postId: ID!) {
  saveComment(content: $content, userId: $userId, postId: $postId) {
    id
    content
    userId
    postId
  }
}
`;

export const SAVEPOST = gql`
mutation savePost($title: String!, $content: String!, $userId: ID!, $image: String!) {
  savePost(title: $title, content: $content, userId: $userId, image: $image) {
    id
    title
    content
    userId
    image
  }
}
`;

export const UPDATEPOST = gql`
  mutation updatePost($id: ID!, $title: String, $content: String, $image: String, $userId: Int) {
    updatePost(id: $id, title: $title, content: $content, image: $image, userId: $userId) {
      id
      title
      content
      image
    }
  }
`;

export const DELETEPOST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;