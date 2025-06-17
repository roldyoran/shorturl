<template>
  <div class="min-h-screen text-gray-100 bg-zinc-950 flex flex-col relative">
    <Toast ref="globalToast" />
    <NavbarHeader :attempts="attempts" />
    
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Principal />
      
      <!-- Main Content -->
      <div class=" space-y-24 mb-10" id="main-content">
        <!-- menu for the function -->
        <div class="grid grid-cols-4 text-sm  mb-6 p-2 rounded-md relative backdrop-blur-sm  shadow-2xl border border-white/5 overflow-hidden bg-zinc-900/60 font-semibold">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-zinc-900/10 to-teal-900/10 pointer-events-none"></div>
            <button
              @click="activeTab = 'shorten'"
              :class="{'bg-zinc-800/80 text-cyan-400 font-semibold': activeTab === 'shorten', 'text-purple-400': activeTab !== 'shorten'}"
              class="px-4 py-1 rounded-md transition-colors duration-300"
            >
              <Link class="inline-block mr-2 w-4" />
              Acortar
            </button>

          <button
            @click="activeTab = 'info'"
            :class="{'bg-zinc-800/80 text-cyan-400 font-semibold': activeTab === 'info', 'text-purple-400': activeTab !== 'info'}"
            class="px-4 py-1 rounded-md transition-colors duration-300"
          >
            <Info class="inline-block mr-2 w-4" />
            Información
          </button>
          <button
            @click="activeTab = 'myurls'"
            :class="{'bg-zinc-800/80 text-cyan-400 font-semibold': activeTab === 'myurls', 'text-purple-400': activeTab !== 'myurls'}"
            class="px-4 py-1 rounded-md transition-colors duration-300"
          >
          <Database class="inline-block mr-2 w-4" />
            Mis URLs
          </button>
          <button
            @click="activeTab = 'list'"
            :class="{'bg-zinc-800/80 text-cyan-400 font-semibold': activeTab === 'list', 'text-purple-400': activeTab !== 'list'}"
            class="px-4 py-1 rounded-md transition-colors duration-300"
          >
          <List class="inline-block mr-2 w-4" />
            Lista URLs
          </button>
        </div>
        <transition name="fade" mode="out-in">
          <div :key="activeTab">
            <div class=" min-h-60">
              <ShortenUrl v-if="activeTab === 'shorten'" @url-shortened="incrementAttempts" />
              <UrlInfo v-else-if="activeTab === 'info'" />
              <MyUrls v-else-if="activeTab === 'myurls'" />
              <UrlList v-else-if="activeTab === 'list'" />
            </div>
          </div>
        </transition>
      </div>
    </main>

    <!-- Footer -->
    <footer class=" bg-gradient-to-tl from-zinc-950 via-xinc-600 to-zinc-950 backdrop-blur-md text-zinc-200/50 text-center py-6 mt-auto border-t border-white/10 shadow-inner">
      <p>&copy; {{ new Date().getFullYear() }} ShortURL by roldyoran. Todos los derechos reservados.</p>
      <p class="text-sm">Desarrollado con Vue.js, Tailwind CSS y Cloudflare Workers.</p>
    </footer>
    
  
  </div>
</template>

<script setup lang="ts">
declare global {
	interface Window {
		$toast: (message: string, options?: any) => void;
	}
}

import { ref, onMounted } from "vue";
import { Info, Link, Database, List } from "lucide-vue-next";
import Toast from "./components/Toast.vue";
import NavbarHeader from "./components/NavbarHeader.vue";
import Principal from "./components/Principal.vue";

import ShortenUrl from "./components/ShortenUrl.vue";
import UrlInfo from "./components/UrlInfo.vue";
import MyUrls from "./components/MyUrls.vue";
import UrlList from "./components/UrlList.vue";

type Tab = "shorten" | "info" | "myurls" | "list";

const activeTab = ref<Tab>("shorten");
const attempts = ref(0);

const globalToast = ref();

const incrementAttempts = () => {
	attempts.value++;
};

// Hacerlo accesible globalmente (opcional)
onMounted(() => {
	window.$toast = (message, options) => {
		globalToast.value?.showToast(message, options);
	};
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-modal-enter-to,
.fade-modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>