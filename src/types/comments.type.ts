export type CommentsType = {
  allCount: number,
  comments: {
    id: string,
    text: string,
    date: string,
    likesCount: 1,
    dislikesCount: 1,
    user: {
      id: string,
      name: string,
    },
  }[],
}
