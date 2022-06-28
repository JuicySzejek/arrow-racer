import './css/style.css';
import Main from './components/Main';

function init() {
    //div
    const container = document.getElementById('root');
    //main class object
    if (container) new Main(container);
}

init();