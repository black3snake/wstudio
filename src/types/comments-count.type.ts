export type CommentsCountType = {
  allCount: number,
  comments: CommentsType[],
}

export type CommentsType = {
  id: string,
  text: string,
  date: string,
  likesCount: 1,
  dislikesCount: 1,
  user: {
    id: string,
    name: string,
  },
  reactionAction?: string,
}
