<template>
    <div class="rounded-lg shadow border border-white/10 bg-zinc-900/80 backdrop-blur-sm">
      <div class="p-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar URLs..."
              class="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>
  
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-purple-300 uppercase bg-gradient-to-r from-zinc-800/50 to-zinc-900/50">
          <tr>
            <th scope="col" class="px-6 py-3">URL</th>
            <th scope="col" class="px-6 py-3">Fecha</th>
            <th scope="col" class="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            class="hover:bg-white/5 transition-colors duration-200"
            v-for="url in filteredUrls"
            :key="url.short_url"
          >
            <td class="px-6 py-4 max-w-[300px]">
              
                <div class="flex items-center gap-2 text-zinc-300 mb-1">
                <Globe class="w-4 h-4 text-zinc-500 shrink-0" />
              <a
                :href="baseUrl + url.short_url"
                target="_blank"
                class="text-cyan-400 hover:text-cyan-300 hover:underline break-all flex items-center gap-2 group font-mono"
              >
                <span class="truncate">{{ baseUrl }}{{ url.short_url }}</span>
                <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
            </div>
                <a
                  :href="url.original_url"
                  target="_blank"
                  class="hover:underline transition-all hover:text-cyan-300 truncate"
                  :title="url.original_url"
                >
                  {{ url.original_url.length > 50 ? url.original_url.substring(0, 50) + '...' : url.original_url }}
                </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-md">
              <div class="flex items-center gap-2 text-zinc-400">
                <Clock class="w-4 h-4 shrink-0" />
                <span>{{ formatDate(url.created_at) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="copyToClipboard(baseUrl + url.short_url)"
                  class="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-200 tooltip"
                  data-tooltip="Copiar URL completa"
                >
                  <Copy class="w-4 h-4" />
                </button>
                <button 
                  @click="copyToClipboard(url.short_url)"
                  class="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200 tooltip"
                  data-tooltip="Copiar código"
                >
                  <Hash class="w-4 h-4" />
                </button>
                
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
	Search,
	Copy,
	ExternalLink,
	Globe,
	Clock,
	Hash,
	Trash,
} from "lucide-vue-next";
import { copyToClipboard } from "../utils/copyUrl";
import { getUrlsRequest } from "../api/http";

interface Url {
	short_url: string;
	original_url: string;
	clicks: number;
	created_at: string;
}

const baseUrl = "https://shorturl.roldyoran.workers.dev/";
const shortUrls = ref<Url[]>([]);
const searchQuery = ref("");

const fetchShortUrls = async () => {
	try {
		const response = await getUrlsRequest();
		shortUrls.value = response.data;
	} catch (error) {
		console.error("Error fetching short URLs:", error);
	}
};

const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};
	return new Date(dateString).toLocaleDateString("es-ES", options);
};

const filteredUrls = computed(() => {
	if (!searchQuery.value) return shortUrls.value;

	const query = searchQuery.value.toLowerCase();
	return shortUrls.value.filter(
		(url) =>
			url.short_url.toLowerCase().includes(query) ||
			url.original_url.toLowerCase().includes(query),
	);
});

onMounted(fetchShortUrls);
</script>
  

  
<style scoped>
.tooltip {
  position: relative;
}

.tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.tooltip:hover::before {
  opacity: 1;
  visibility: visible;
}
</style>