<template>
  <div class="container">
    <Drawer v-model:open="isShowSwipeableCards">
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Find new friend!</DrawerTitle>
            <DrawerDescription>Liked card will save to your chat.</DrawerDescription>
          </DrawerHeader>
          <div data-vaul-no-drag class="p-4 pb-0">
            <SwipeableCards @like="handleLike" @dislike="handleDislike" :liked-bots="likedBots" />
          </div>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button>
                Go back to chat
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>

    <!-- Chat room -->
    <div class="flex flex-col gap-4 chat-room">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">Liked List ({{ likedBots.length }})</h1>
        <ScrollArea style="--max-height-liked-list: 600px;" class="flex flex-col gap-4 w-full max-h-[--max-height-liked-list] before:content-[''] before:w-full">
          <ul class="flex flex-col flex-wrap gap-2">
            <li v-if="likedBots.length === 0" class="text-center flex gap-2 items-center flex-col p-8 border rounded">
              <Meh :size="32" />
              No likes yet.
            </li>
            <li v-for="{ id, name, image, bio } in likedBots" :key="id">
              <button type="button" :class="`text-left p-4 border rounded w-full flex items-center gap-2 hover:bg-muted ${activeBotId === id ? 'bg-muted' : ''}`" @click="activeBotId = id">
                <Avatar>
                  <AvatarImage :src="image.avatar.src" :alt="`${name}'s avatar`" />
                  <AvatarFallback>{{ `${name}'s avatar` }}</AvatarFallback>
                </Avatar>
         
                <div>
                  <h2 class="text-lg font-medium">{{ name }}</h2>
                  <p class="text-sm line-clamp-1">{{ bio }}</p>
                </div>
              </button>
            </li>
          </ul>
        </ScrollArea>
        <!-- Find more AI friends -->
        <button type="button" @click="isShowSwipeableCards = !isShowSwipeableCards" class="p-4 border rounded w-full flex items-center justify-center gap-4 hover:bg-muted">
          <UserRoundPlus :size="24" class="-mb-1" />
          Find more AI friends
        </button>
      </div>
      
      <!-- Chats -->
      <div class="border p-4 rounded w-full">
        <!-- <div v-if="activeBot"> -->
        
        <div v-if="activeBot" class="flex flex-col gap-4 h-full">
          <!-- Chats Header -->
          <div class="border-b pb-4 flex justify-between items-center gap-2">
            <div class="flex items-center gap-2">
              <Avatar>
                <AvatarImage :src="activeBot.image.avatar.src ?? ''" :alt="`${activeBot.name}'s avatar`" />
                <AvatarFallback>{{ `${activeBot.name}'s avatar` }}</AvatarFallback>
              </Avatar>
              <div>{{ activeBot.name }}</div>
            </div>
            <Button size="icon" variant="ghost"><Info/></Button>
          </div>
  
          <!-- Chat Content -->
          <div class="flex flex-col gap-4 h-full">
            <Chat :avatar="{
              src: 'https://github.com/shadcn.png',
              alt: 'User avatar'
            }">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi fugit quisquam unde eius veritatis suscipit natus debitis rerum vel aliquid soluta, eos iste quaerat accusamus voluptatem maxime incidunt iusto? Iste.  
            </Chat>

            <Chat class="self-end" :avatar="{
              src: 'https://github.com/shadcn.png',
              alt: 'User avatar'
            }">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi fugit quisquam unde eius veritatis suscipit natus debitis rerum vel aliquid soluta, eos iste quaerat accusamus voluptatem maxime incidunt iusto? Iste.  
            </Chat>

          </div>

          <!-- Chat Footer -->
          <form @submit.prevent="handleSendChat" class="flex gap-2 pt-4">
            <FormField v-slot="{ componentField }" name="message">
              <FormItem class="w-full">
                <FormControl>
                  <Input type="text" class="rounded-full px-4" placeholder="Type something..." v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button class="rounded-full">
              <Send />
              <span class="sr-only">Send Message</span>
            </Button>
          </form>
        </div>
        <div v-else class="flex justify-center items-center h-full">
          <p class="flex flex-col items-center gap-2"><ScanFace :size="64" />Select a friend to chat</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'basic',
  })
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { Bots, Bot } from '@/utils/type/bots'
  import SwipeableCards from '@/components/chat/SwipeableCards.vue'
  import Chat from '@/components/chat/Chat.vue'
  import { UserRoundPlus, Meh, Info, Send, ScanFace } from 'lucide-vue-next';
  import { sendChatSchema } from '@/utils/schemas/send-chat'
  
  const likedBots = ref<Bots>([])
  const activeBotId = ref<string | null>(null)
  const activeBot = computed(() => likedBots.value.find((bot) => bot.id === activeBotId.value))
  const isShowSwipeableCards = ref(false)

  function handleLike(e: Bot) {
    const isPersonAlreadyLiked = likedBots.value.some((bot) => bot.id === e.id)
    if (isPersonAlreadyLiked) return
    likedBots.value = [...likedBots.value, e]
  }

  function handleDislike(e: Bot) {
    likedBots.value = likedBots.value.filter((bot) => bot.id !== e.id)
  }

  const handleSendChat = useForm({validationSchema: toTypedSchema(sendChatSchema)})
  .handleSubmit((values) => {
    alert(JSON.stringify(values))
  })
</script>

<style scoped>
  @media screen(md) {
    .chat-room {
      display: grid;
      grid-template-columns: 300px 1fr;
    }
  }
</style>