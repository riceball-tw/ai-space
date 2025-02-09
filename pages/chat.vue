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
            <template v-if="relatedBotsStatus === 'success'">
              <li v-if="likedBots.length === 0" class="text-center flex gap-2 items-center flex-col p-8 border rounded">
                <Meh :size="32" />
                No likes yet.
              </li>
              <li v-for="{ id, name, image, bio } in likedBots" :key="id">
                <button type="button" :class="`text-left p-4 border rounded w-full flex items-center gap-2 hover:bg-muted ${activeBotId === id ? 'bg-muted' : ''}`" @click="() => {
                  activeBotId = id;
                  handleStartChat(id)
                }">
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
            </template>
            <template v-if="relatedBotsStatus === 'pending'">
              <li v-for="i in 10" :key="i">
                <Skeleton style="height: 80px" class="p-4 border rounded w-full" />
              </li>
            </template>
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
        <div v-if="allHistoryChatsStatus !== 'success'">
          Loading chat history...
        </div>
        <div v-else-if="activeBot" class="flex flex-col gap-4 h-full">
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
            <Chat 
            :avatar="{
              src: activeBot.image.avatar.src,
              alt: `${activeBot.name}'s avatar`
            }"  v-if="isBotLoading">
            Typing...
          </Chat>
            
            <!-- Why Add Z? -->
            <!-- Convert UTC date time to local date time - stack overflow -->
            <!-- https://stackoverflow.com/a/48822115/14927277 -->
            <Chat v-for="chat in activeHistoryChats" 
            :avatar="chat.role === 'user' ? {
              src: '',
              alt: 'Me',
            } : {
              src: activeBot.image.avatar.src,
              alt: `${activeBot.name}'s avatar`
            }" 
            :time="new Date(chat.created_at + 'Z').toLocaleTimeString()"
            :direction="chat.role === 'user' ? 'right' : 'left'"
            >
              {{ chat.content }} 
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
              <Loader2 v-if="isSendingMessage" class="animate-spin" className="animate-spin" />
              <Send v-else />
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
  import * as z from 'zod'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import type { Bots, Bot } from '@/utils/type/bots'
  import type { ChatHistory } from '@/utils/type/chat-history'
  import { chatHistoryBodySchema } from '@/utils/schemas/chat-history'
  import { botChatSchema } from '@/utils/schemas/bot'
  import SwipeableCards from '@/components/chat/SwipeableCards.vue'
  import Chat from '@/components/chat/Chat.vue'
  import { UserRoundPlus, Meh, Info, Send, ScanFace, Loader2 } from 'lucide-vue-next';
  import { sendChatSchema } from '@/utils/schemas/send-chat'
  import type { GenerateContentResult } from '@google/generative-ai'

  type ChatHistoryRequestBody = z.infer<typeof chatHistoryBodySchema>
  type botChatSchema = z.infer<typeof botChatSchema>

  const { data: likedBotsCloudData, status: relatedBotsStatus } = await useLazyFetch<Bots>('/api/bots')  // No idea `JSON` type generated by supabase in image col for now, manually type here
  const { data: allHistoryChatsCloudData, status: allHistoryChatsStatus } = useLazyFetch('/api/chat')

  /**
   *  For update first client side load
   *  Fetch is lazy loaded, so watch and push to accumulated ref, only on first 
   */
  watch(likedBotsCloudData, () => {
      likedBots.value = likedBotsCloudData.value || []
  }, { once: true })

  watch(allHistoryChatsCloudData, () => {
      historyChats.value = Array.isArray(allHistoryChatsCloudData.value) ? allHistoryChatsCloudData.value : []
  }, { once: true })

  const likedBots = ref(Array.isArray(likedBotsCloudData.value) ? likedBotsCloudData.value : []) 
  const historyChats = ref(Array.isArray(allHistoryChatsCloudData.value) ? allHistoryChatsCloudData.value : [])
  const isShowSwipeableCards = ref(false)
  const isBotLoading = ref(false)
  const isSendingMessage = ref(false)
  // --- Active ---
  const activeBotId = ref<string | null>(null)
  const activeBot = computed(() => likedBots.value.find((bot) => bot.id === activeBotId.value))
  const activeHistoryChats = computed(() => 
    historyChats.value
      .filter(chat => chat.bot_id === activeBotId.value)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  )

  /**
   * Add target bot to like
   */
  async function handleLike(targetBot: Bot) {
    const isPersonAlreadyLiked = likedBots.value.some((bot) => bot.id === targetBot.id)
    if (isPersonAlreadyLiked) return

    try {
      await $fetch('/api/bots/', {
        method: 'POST',
        body: targetBot,
      })
      likedBots.value = [...likedBots.value, targetBot]
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Remove target bot from like
   */
  function handleDislike(targetBot: Bot) {
    likedBots.value = likedBots.value.filter((bot) => bot.id !== targetBot.id)
  }

  /**
   * Add new chat history
   */
  async function updateChatHistory(chatHistoryRequestBody: ChatHistoryRequestBody) {
    return await $fetch<ChatHistory>('/api/chat/history', {
      method: 'POST',
      body: chatHistoryRequestBody satisfies ChatHistoryRequestBody
    })
  }

  /**
   * Get Bot reply
   */
  async function botReply({bot, history}: botChatSchema) {
    return await $fetch<GenerateContentResult>('/api/chat/reply', {
      method: 'POST',
      body: {
        bot,
        history: history?.map(chat => ({
          role: chat.role,
          content: chat.content
        }))
      }
    })
  }

  /**
   * Send Chat
   */
  const { handleSubmit: sendChatHandleSubmit, resetForm: sendChatResetForm } = useForm({validationSchema: toTypedSchema(sendChatSchema)})
  const handleSendChat = sendChatHandleSubmit(async ({ message }) => {
    if (isSendingMessage.value) return
    try {
      isSendingMessage.value = true
      if (!activeBotId.value) return
      if (!activeBot.value) return
      const newChat = await updateChatHistory({
        role: 'user',
        content: message,
        botId: activeBotId.value
      })
      historyChats.value = [...historyChats.value, newChat]
      sendChatResetForm()
      const reply = await botReply({bot: activeBot.value, history: activeHistoryChats.value})
      const candidates = reply.response.candidates
      if (!candidates) return
      const initContent = candidates[0].content
      const newBotReply = await updateChatHistory({
        botId: activeBotId.value, 
        content: initContent.parts[0].text || '', 
        role: initContent.role
      })
      historyChats.value = [...historyChats.value, newBotReply]
    } catch(err) {
      console.error(err)
    } finally {
      isSendingMessage.value = false
    }
  })

  /**
   * First time chat will fire a bot reply and update chat history as start
   */
  async function handleStartChat(targetBotId: string) {
    if (allHistoryChatsCloudData.value && Array.isArray(allHistoryChatsCloudData.value)) {
      const isBotChatted = historyChats.value.some(chat => chat.bot_id === targetBotId)
      if (!isBotChatted && !isBotLoading.value) {
        try {
          isBotLoading.value = true
          if (!activeBot.value) return;
          const reply = await botReply({ bot: activeBot.value })
          const candidates = reply.response.candidates
          if (!candidates) return
          const initContent = candidates[0].content
          const newChat = await updateChatHistory({
            botId: targetBotId, 
            content: initContent.parts[0].text || '', 
            role: initContent.role
          })
          if (!newChat) return
          historyChats.value = [...historyChats.value, newChat]
        } catch (err) {
          console.error(err);
        } finally {
          isBotLoading.value = false
        }
      }
    }
  }
</script>

<style scoped>
  @media screen(md) {
    .chat-room {
      display: grid;
      grid-template-columns: 300px 1fr;
    }
  }
</style>