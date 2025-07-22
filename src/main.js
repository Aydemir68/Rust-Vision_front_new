import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import Aura from '@primevue/themes/aura'
import '/node_modules/primeflex/primeflex.css'
import 'primeflex/themes/primeone-light.css';
import App from './App.vue'
import './assets/main.css'
import 'primeicons/primeicons.css'


const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});
app.mount('#app');
