import { init as initState } from './state';
import { init as initCommunication } from './communication';
import { init as initNavigation, switchPage } from './navigation';
import router from './router';

initState();
initCommunication();
initNavigation(router);
switchPage('index');
