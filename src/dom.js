import { VNode } from './vdom';
import { directives } from './directives';


const DOM = {
    isEventAttribute(attr) {
        return /^on/.test(attr);
    },
      
    setEventListener(element, event, handler) {
        const eventName = event.slice(2).toLowerCase();
        element.addEventListener(eventName, handler);
    },

    applyDirectives(element, vnode) {
        for (const directive in vnode.directives) {
          if (vnode.directives.hasOwnProperty(directive)) {
            const handler = directives[directive];
            if (handler) {
              handler(element, vnode.directives[directive]);
            }
          }
        }
    },
      
    createElement(tag, attrs = {}, children = [], vnode) {
        const element = document.createElement(tag);
      
        for (const attr in attrs) {
          if (attrs.hasOwnProperty(attr)) {
            if (this.isEventAttribute(attr)) {
              this.setEventListener(element, attr, attrs[attr]);
            } else {
              element.setAttribute(attr, attrs[attr]);
            }
          }
        }
      
        children.forEach((child) => {
          const childNode =
            typeof child === 'string' || typeof child === 'number'
              ? document.createTextNode(child)
              : (child instanceof VNode ? child.render() : child);
          element.appendChild(childNode);
        });
      
        if (vnode instanceof VNode) {
            this.applyDirectives(element, vnode);
        }
        
          return element;
    },
  
    updateElement(element, newAttrs, oldAttrs = {}) {
      for (const attr in newAttrs) {
        if (newAttrs.hasOwnProperty(attr) && newAttrs[attr] !== oldAttrs[attr]) {
          element.setAttribute(attr, newAttrs[attr]);
        }
      }
  
      for (const attr in oldAttrs) {
        if (oldAttrs.hasOwnProperty(attr) && !(attr in newAttrs)) {
          element.removeAttribute(attr);
        }
      }
    },
  
    removeElement(element) {
      element.parentNode.removeChild(element);
    },
  };
  
  export default DOM;
  