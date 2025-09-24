<template>
  <div class="min-h-screen flex flex-col">
    <Toaster class="pointer-events-auto" />
    
    <NavbarHeader :attempts="attempts" />
    
    <main class="flex-grow container mx-auto px-4 py-8">
      <Principal />
      
      <!-- Sonner Test (temporal) -->
      <!-- <div class="mb-8">
        <SonnerTest />
      </div> -->
      
      <!-- Config Test (temporal) -->
      <!-- <div class="mb-8">
        <ConfigTest />
      </div> -->
      
      <!-- Main Content -->
      <div class="space-y-8 mb-10">
        <!-- Navigation Tabs -->
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger value="shorten" class="flex items-center gap-2">
              <Link class="w-4 h-4" />
              <span class="hidden sm:inline">Acortar</span>
            </TabsTrigger>
            <TabsTrigger value="info" class="flex items-center gap-2">
              <Info class="w-4 h-4" />
              <span class="hidden sm:inline">Información</span>
            </TabsTrigger>
            <TabsTrigger value="myurls" class="flex items-center gap-2">
              <Database class="w-4 h-4" />
              <span class="hidden sm:inline">Mis URLs</span>
            </TabsTrigger>
            <TabsTrigger value="list" class="flex items-center gap-2">
              <List class="w-4 h-4" />
              <span class="hidden sm:inline">Lista URLs</span>
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
    <footer class="border-t py-6 mt-auto">
      <div class="container mx-auto text-center text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} ShortURL by roldyoran. Todos los derechos reservados.</p>
        <p class="text-sm">Desarrollado con Vue.js, Tailwind CSS y Cloudflare Workers.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Info, Link, Database, List } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";
import { useUrlStore } from "@/stores/urlStore";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import
import NavbarHeader from "@/components/NavbarHeader.vue";
import Principal from "@/components/Principal.vue";

import ShortenUrlForm from "@/components/features/url-shortener/ShortenUrlForm.vue";
import UrlInfoForm from "@/components/features/url-info/UrlInfoForm.vue";
import MyUrlsList from "@/components/features/my-urls/MyUrlsList.vue";
import PublicUrlsList from "@/components/features/url-list/PublicUrlsList.vue";
import SonnerTest from "@/components/SonnerTest.vue";
import ConfigTest from "@/components/ConfigTest.vue";

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