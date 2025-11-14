export type ArticleDetailType = {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
  text: string,
  commentsCount: number,
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


