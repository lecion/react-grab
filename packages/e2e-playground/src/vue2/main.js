import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const app = new Vue({
  router,
  render: h => h(App),
  mounted() {
    // Wait for Vue to fully initialize
    setTimeout(async () => {
      // Debug: Check Vue2 detection manually
      const elements = document.querySelectorAll('header');
      if (elements.length > 0) {
        const header = elements[0];
        console.log('[Debug] Header element:', header.tagName);
        console.log('[Debug] __vue__ on header:', !!header.__vue__);
        if (header.__vue__) {
          console.log('[Debug] $options.name:', header.__vue__.$options?.name);
          console.log('[Debug] $options.__file:', header.__vue__.$options?.__file);
        }
      }

      // Use dynamic import to avoid auto-init during module load
      const reactGrab = await import('react-grab');
      reactGrab.init();
    }, 100);
  }
}).$mount('#app');
