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
    <footer class="border-t bg-gradient-to-b from-background/80 to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6 mt-auto">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Logo y descripción -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <Link class="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 class="font-bold text-base">ShortURL</h3>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Acortador de URLs rápido y seguro. 
              <span class="inline-flex items-center gap-1">
                <Zap class="w-3 h-3" />
                Optimizado para velocidad.
              </span>
            </p>
            <div class="flex items-center gap-2 text-xs">
              <div class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-muted-foreground">Activo</span>
              </div>
              <div class="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
              <span class="text-muted-foreground">{{ attempts.toLocaleString() }} URLs</span>
            </div>
          </div>

          <!-- Enlaces rápidos -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Globe class="w-3.5 h-3.5 text-primary" />
              <h4 class="text-xs font-semibold text-foreground">Navegación</h4>
            </div>
            <nav class="space-y-1.5">
              <button 
                @click="activeTab = 'shorten'" 
                class="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 group"
              >
                <Link class="w-3 h-3 group-hover:rotate-12 transition-transform" />
                Acortar URLs
              </button>
              <button 
                @click="activeTab = 'info'" 
                class="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 group"
              >
                <Info class="w-3 h-3 group-hover:scale-110 transition-transform" />
                Información
              </button>
              <button 
                @click="activeTab = 'myurls'" 
                class="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 group"
              >
                <Database class="w-3 h-3 group-hover:scale-110 transition-transform" />
                Mis URLs
              </button>
              <button 
                @click="activeTab = 'list'" 
                class="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 group"
              >
                <List class="w-3 h-3 group-hover:scale-110 transition-transform" />
                Lista Pública
              </button>
            </nav>
          </div>

          <!-- Stack Frontend -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Code2 class="w-3.5 h-3.5 text-primary" />
              <h4 class="text-xs font-semibold text-foreground">Frontend</h4>
            </div>
            <div class="flex flex-wrap gap-1">
              <Badge variant="secondary" class="text-xs py-0 px-2 hover:bg-primary/10 transition-colors">Vue 3</Badge>
              <Badge variant="secondary" class="text-xs py-0 px-2 hover:bg-primary/10 transition-colors">TypeScript</Badge>
              <Badge variant="secondary" class="text-xs py-0 px-2 hover:bg-primary/10 transition-colors">Tailwind</Badge>
              <Badge variant="secondary" class="text-xs py-0 px-2 hover:bg-primary/10 transition-colors">Shadcn/ui</Badge>
              <Badge variant="secondary" class="text-xs py-0 px-2 hover:bg-primary/10 transition-colors">Pinia</Badge>
            </div>
            <div class="pt-1">
              <a 
                href="https://github.com/roldyoran" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
              >
                <Github class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>@roldyoran</span>
                <svg class="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Stack Backend -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <Zap class="w-3.5 h-3.5 text-primary" />
              <h4 class="text-xs font-semibold text-foreground">Backend</h4>
            </div>
            <div class="flex flex-wrap gap-1">
              <Badge variant="outline" class="text-xs py-0 px-2 hover:bg-primary/5 transition-colors">Workers</Badge>
              <Badge variant="outline" class="text-xs py-0 px-2 hover:bg-primary/5 transition-colors">D1</Badge>
              <Badge variant="outline" class="text-xs py-0 px-2 hover:bg-primary/5 transition-colors">Hono.js</Badge>
              <Badge variant="outline" class="text-xs py-0 px-2 hover:bg-primary/5 transition-colors">Zod</Badge>
            </div>
            <div class="pt-1">
              <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart class="w-3 h-3 text-red-500 animate-pulse" />
                <span>Hecho con pasión</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Separador y pie -->
        <div class="border-t mt-6 pt-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-3">
            <div class="flex flex-col md:flex-row items-center gap-3">
              <p class="text-xs text-muted-foreground">
                &copy; {{ new Date().getFullYear() }} ShortURL. 
                <span class="font-medium">API & Frontend</span>
              </p>
              <div class="flex items-center gap-1 text-xs text-muted-foreground">
                <Star class="w-3 h-3 text-yellow-500" />
                <span>Open Source</span>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs text-muted-foreground">En línea</span>
                <div class="w-1 h-1 bg-muted-foreground/50 rounded-full ml-1"></div>
                <span class="text-xs font-medium text-foreground ml-1">
                  {{ attempts.toLocaleString() }} URLs
                </span>
              </div>
              
              <div class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Info, Link, Database, List, Github, Star, Heart, Code2, Globe, Zap } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";
import { useUrlStore } from "@/stores/urlStore";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import 'vue-sonner/style.css'; // vue-sonner v2 requires this import
import NavbarHeader from "@/components/NavbarHeader.vue";
import Principal from "@/components/Principal.vue";

import ShortenUrlForm from "@/components/features/url-shortener/ShortenUrlForm.vue";
import UrlInfoForm from "@/components/features/url-info/UrlInfoForm.vue";
import MyUrlsList from "@/components/features/my-urls/MyUrlsList.vue";
import PublicUrlsList from "@/components/features/url-list/PublicUrlsList.vue";
// Removed unused test components (were causing TS6133)

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