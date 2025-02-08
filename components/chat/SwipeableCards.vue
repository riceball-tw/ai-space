<template>
  <div class="flex flex-col items-center gap-4">
    <ClientOnly>
      <div v-if="!totalBots" class="p-8 border text-center">
        <h2 class="text-xl">Loading...</h2>
        <p class="text-sm">Preparing your personal experience.</p>
      </div>
      <swiper-container
      v-else
      class="h-full w-full rounded max-w-[70vw]"
      :grab-cursor="true"
      :effect="'cards'"
      @swiperslidechange="handleSlideChange"
      @swiperafterinit="hasSwiperInited = true"
      ref="containerRef">
        <swiper-slide
          v-for="{id, name, image, bio} in totalBots"
          class="relative bg-background"
          :key="id"
        >
          <!-- Swiper Lazy Loading: https://swiperjs.com/swiper-api#lazy-loading -->
          <Skeleton class="swiper-lazy-preloader absolute top-0 left-0 w-full h-full" />
          <img class="rounded z-10 relative" :width="image.swipeCard.width" :height="image.swipeCard.height" :src="image.swipeCard.src" :alt="`${name} Avatar`">
          <!-- Badge -->
          <div v-if="likedBots.some(likedBot => likedBot.id === id)" class="absolute top-0 left-0 z-10 border-2 border-success text-success font-bold px-4 py-2 rounded-full m-4 -rotate-12 bg-success/20">Liked</div>
          <!-- Overlay Content -->
          <div class="absolute z-10 bottom-0 left-0 text-background p-4 w-full before:content-[''] before:w-full before:h-full before:absolute before:left-0 before:bottom-0 before:bg-gradient-to-b before:from-transparent before:to-foreground before:rounded">
            <div class="relative">
              <h2 class="text-xl font-bold">{{ name }}</h2>
              <p>{{ bio }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>

      <template #fallback>
        <div class="p-8 border text-center">
          <h2 class="text-xl">Loading...</h2>
          <p class="text-sm">Preparing your personal experience.</p>
        </div>
      </template>
    </ClientOnly>

    <div class="flex gap-4">
      <!-- Skip -->
      <button class="w-14 h-14 shadow rounded-full flex justify-center items-center text-destructive hover:bg-destructive/10 transition-colors" type="button" @click="handleDislike">
        <X class="-mb-0.5 stroke-current" />
      </button>

      <!-- Like -->
      <button class="w-14 h-14 shadow rounded-full flex justify-center items-center text-success hover:bg-success/10 transition-colors" type="button" @click="handleLike">
        <Heart class="-mb-0.5 stroke-current" />
      </button>
  </div>
  </div>
</template>

<script setup lang="ts">
  import { X } from 'lucide-vue-next';
  import { Heart } from 'lucide-vue-next';
  import { nextTick } from 'vue';
  import type { Bots } from '@/utils/type/bots'

  const { likedBots } = defineProps<{
    likedBots: Bots;
  }>();

  const emit = defineEmits<{
    (event: 'like', payload: NonNullable<Bots>[number]): void;
    (event: 'dislike', payload: NonNullable<Bots>[number]): void;
  }>();

  const containerRef = ref(null)
  const swiper = useSwiper(containerRef)
  const { data: bots, status: botsStatus, execute: botsExecute } = useLazyFetch('/api/bots/random')
  const totalBots = ref<Bots | null>(bots.value)
  const hasSwiperInited = ref(false)

  function handleLike() {
    const activeBotIndex = swiper.instance.value?.realIndex
    if (!activeBotIndex && activeBotIndex !== 0) return
    if (!totalBots.value) return

    emit('like', totalBots.value[activeBotIndex])
    swiper.next()
  }

  function handleDislike() {
    const activeBotIndex = swiper.instance.value?.realIndex
    if (!activeBotIndex && activeBotIndex !== 0) return
    if (!totalBots.value) return

    emit('dislike', totalBots.value[activeBotIndex])
    swiper.next()
  }

  async function handleSlideChange() {
    if (!bots) return
    if (!totalBots.value) return

    const totalSlideLength = totalBots.value.length
    const currentSlideIndex = swiper.instance.value?.realIndex
    const reachEndRemainingCard = 2
    const isReachEnd = currentSlideIndex === totalSlideLength - reachEndRemainingCard

    if (isReachEnd) {
      botsExecute()
      await nextTick()
      swiper.instance.value?.update()
    }
  }

  // Watch for new bots from useFetch, add to totalBots
  watch(bots, newBots => {
    if (!newBots) return
    totalBots.value = [...totalBots.value || [], ...newBots]
  })  
</script>
