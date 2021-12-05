import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import registerComponents from "@/components/globals";
import router from "./router"
import store from "./store"
import App from './App.vue'

library.add(fas, faSearch, faPaperPlane);

const app = createApp(App);
app.use(store);
app.use(router);

registerComponents(app);
app.component('fa', FontAwesomeIcon);

router.isReady().then(() => app.mount("#app"));
