import DOM from './dom';
import { VNode, diff, patch } from './vdom';

// Example component
function App(count, onClick, onClickDown) {
    return new VNode('div', { id: 'counter' }, [
      new VNode('p', {}, [], { text: `Count: ${count}` }),
      new VNode('button', { id: 'increment', onclick: onClick }, ['+']),
      new VNode('button', { id: 'decrement', onclick: onClickDown }, ['-'])
    ]);
}

// Initial state
let count = 0;

// Click event handler
const handleButtonClick = () => {
    count++;
    updateApp();
  };

const handleButtonClickDown = () => {
    count--;
    updateApp();
};

// Function to update the App
const updateApp = () => {
    const newVApp = App(count, handleButtonClick, handleButtonClickDown);
    const newApp = newVApp.render();
    const oldApp = document.getElementById('counter');
    oldApp.parentNode.replaceChild(newApp, oldApp);
  };

// Render the initial virtual DOM
let vApp = App(count, handleButtonClick);
const app = vApp.render();
document.body.appendChild(app);
  
