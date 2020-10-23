import { init as initState } from './state';
import { init as initNavigation, switchPage } from './navigation';
import router from './router';

initState();
initNavigation(router);
switchPage('index');
