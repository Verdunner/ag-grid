import { createApp } from 'vue';
import App from './App.vue';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule]);

createApp(App).mount('#app');
