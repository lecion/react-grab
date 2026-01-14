import Vue from 'vue';
import App from './App.vue';
import router from './router';

// Import and initialize react-grab
import { init } from 'react-grab';

// Initialize react-grab with Vue2 detection
init();

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
