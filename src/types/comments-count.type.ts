export type CommentsCountType = {
  allCount: number,
  comments: CommentsType[],
}

export type CommentsType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string,
  },
  reactionAction?: string,
}
