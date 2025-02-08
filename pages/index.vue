<template>
  <div class="text-background">
    <AppNavbar />
    <div class="dark min-h-screen bg-cover flex justify-center items-center flex-col relative">
      <!-- Mask -->
      <div class="w-full h-full bg-black absolute top-0 left-0 opacity-60 z-0"></div>
      <picture class="-z-10 select-none">
        <source srcset="https://picsum.photos/1200/600" media="(min-width: 600px)">
        <img decoding="async" src="https://picsum.photos/400/1000" width="400" height="1000" class="absolute top-0 left-0 w-full h-full object-cover">
      </picture>
      <div class="flex gap-8 flex-col text-center z-10 relative">
        <h1 class="text-6xl md:text-8xl">AiSpace</h1>
        <p class="text-xl md:text-3xl">A space to connect with interesting virtual-being :)</p>
        <Button as-child class="w-fit mx-auto">
          <NuxtLink to="/chat">
            Get Started
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>