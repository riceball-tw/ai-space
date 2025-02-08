export interface Bot {
  id: string,
  name: string,
  image: {
    avatar: {
      src: string,
      width: number,
      height: number
    },
    swipeCard: {
      src: string,
      width: number,
      height: number
    },
  },
  bio: string,
}

export type Bots = Bot[];