export type CommentActionType = {
  comment: string,
  action: userCommentActions
}

export enum userCommentActions  {
  like = 'like',
  dislike = 'dislike',
  violate = 'violate'
}
