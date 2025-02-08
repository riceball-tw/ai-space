import { faker } from '@faker-js/faker';
import type { Bots } from '@/utils/type/bots'

export default defineEventHandler(async () => {
  return (Array.from({ length: 3 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: {
      avatar: {
        src: faker.image.urlPicsumPhotos({
          width: 100,
          height: 100,
        }),
        width: 100,
        height: 100,
      },
      swipeCard: {
        src: faker.image.urlPicsumPhotos({
          width: 600,
          height: 848,
        }),
        width: 600,
        height: 848,
      }
    },
    bio: faker.person.bio(),
  }))) as Bots
});
