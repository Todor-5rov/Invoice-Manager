import { defineNuxtPlugin } from "#app";
import { toast } from "vue-hot-toast";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("showToast", toast);
});
