<template>
  <div class="min-h-screen flex flex-col relative">
    <div class="bg-ambient" aria-hidden="true" />
    <Toaster class="pointer-events-auto" />

    <NavbarHeader :attempts="attempts" />

    <main id="main-content" class="flex-grow container mx-auto px-4 py-8 relative z-10" tabindex="-1">
      <Principal />

      <div class="space-y-8 mb-10">
        <Tabs v-model="activeTab" class="w-full">
          <!-- Mobile: vertical layout with clear labels -->
          <div class="block sm:hidden space-y-3">
            <h2 class="text-sm font-semibold text-center text-muted-foreground mb-3">
              Selecciona una funcionalidad:
            </h2>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-label="Acortar URL"
                :aria-pressed="activeTab === 'shorten'"
                @click="activeTab = 'shorten'"
                @keydown.enter.prevent="activeTab = 'shorten'"
                @keydown.space.prevent="activeTab = 'shorten'"
                :class="[
                  'flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeTab === 'shorten'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background hover:bg-muted'
                ]"
              >
                <Link class="w-5 h-5" aria-hidden="true" />
                <span class="text-xs font-medium">Acortar URL</span>
              </button>

              <button
                type="button"
                aria-label="Ver información de URL"
                :aria-pressed="activeTab === 'info'"
                @click="activeTab = 'info'"
                @keydown.enter.prevent="activeTab = 'info'"
                @keydown.space.prevent="activeTab = 'info'"
                :class="[
                  'flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeTab === 'info'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background hover:bg-muted'
                ]"
              >
                <Info class="w-5 h-5" aria-hidden="true" />
                <span class="text-xs font-medium">Ver Info</span>
              </button>

              <button
                type="button"
                aria-label="Mis URLs"
                :aria-pressed="activeTab === 'myurls'"
                @click="activeTab = 'myurls'"
                @keydown.enter.prevent="activeTab = 'myurls'"
                @keydown.space.prevent="activeTab = 'myurls'"
                :class="[
                  'flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeTab === 'myurls'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background hover:bg-muted'
                ]"
              >
                <Database class="w-5 h-5" aria-hidden="true" />
                <span class="text-xs font-medium">Mis URLs</span>
              </button>

              <button
                type="button"
                aria-label="Lista pública de URLs"
                :aria-pressed="activeTab === 'list'"
                @click="activeTab = 'list'"
                @keydown.enter.prevent="activeTab = 'list'"
                @keydown.space.prevent="activeTab = 'list'"
                :class="[
                  'flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                  activeTab === 'list'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background hover:bg-muted'
                ]"
              >
                <List class="w-5 h-5" aria-hidden="true" />
                <span class="text-xs font-medium">Lista Pública</span>
              </button>
            </div>
          </div>

          <!-- Desktop: Original tab layout -->
          <TabsList class="hidden sm:grid w-full grid-cols-4">
            <TabsTrigger value="shorten" class="flex items-center gap-2">
              <Link class="w-4 h-4" />
              <span>Acortar</span>
            </TabsTrigger>
            <TabsTrigger value="info" class="flex items-center gap-2">
              <Info class="w-4 h-4" />
              <span>Información</span>
            </TabsTrigger>
            <TabsTrigger value="myurls" class="flex items-center gap-2">
              <Database class="w-4 h-4" />
              <span>Mis URLs</span>
            </TabsTrigger>
            <TabsTrigger value="list" class="flex items-center gap-2">
              <List class="w-4 h-4" />
              <span>Lista URLs</span>
            </TabsTrigger>
          </TabsList>

          <div class="mt-6">
            <TabsContent value="shorten">
              <ShortenUrlForm @url-shortened="incrementAttempts" />
            </TabsContent>
            <TabsContent value="info">
              <UrlInfoForm />
            </TabsContent>
            <TabsContent value="myurls">
              <MyUrlsList />
            </TabsContent>
            <TabsContent value="list">
              <PublicUrlsList />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>

    <!-- Footer -->
    <FooterComponent :attempts="attempts" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { Info, Link, Database, List } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";
import { useUrlStore } from "@/stores/urlStore";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import
import NavbarHeader from "@/components/NavbarHeader.vue";
import Principal from "@/components/Principal.vue";
import FooterComponent from "@/components/layout/FooterComponent.vue";

import ShortenUrlForm from "@/components/features/url-shortener/ShortenUrlForm.vue";
import UrlInfoForm from "@/components/features/url-info/UrlInfoForm.vue";
import MyUrlsList from "@/components/features/my-urls/MyUrlsList.vue";
import PublicUrlsList from "@/components/features/url-list/PublicUrlsList.vue";
// Removed unused test components (were causing TS6133)
const mode = useColorMode()

// Apply the theme class to the document element
watchEffect(() => {
  if (mode.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})


type Tab = "shorten" | "info" | "myurls" | "list";

// Usar stores de Pinia
const urlStore = useUrlStore();

// Inicializar el modo de color
useColorMode();

// Usar el estado del store en lugar de refs locales
const activeTab = ref<Tab>(urlStore.currentTab);
const attempts = ref(urlStore.urlCount);

const incrementAttempts = () => {
	attempts.value++;
};

// Hacerlo accesible globalmente (opcional)
onMounted(() => {
	// Inicializar los stores
	urlStore.initialize();

	// Sincronizar el tab activo con el store
	activeTab.value = urlStore.currentTab;
	attempts.value = urlStore.urlCount;
});
</script>


<style scoped>
@keyframes gentle-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .github-bounce {
    animation: none;
  }
}
.github-bounce {
  animation: gentle-bounce 3s ease-in-out infinite;
}
.github-bounce:hover {
  animation: none;
}
</style>