import DOM from './dom';
import { directives } from './directives';

// Virtual DOM representation
class VNode {
    constructor(tag, attrs, children, directives = {}) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.directives = directives;
      }
  
    render() {
      return DOM.createElement(
        this.tag,
        this.attrs,
        this.children.map(child =>
          child instanceof VNode ? child.render() : child
        ),
        this
      );
    }
  }
  
  // Diffing and patching
  function diff(oldVNode, newVNode) {
    if (oldVNode === null || newVNode === null) {
      return true;
    }
  
    if (typeof oldVNode !== 'object' || typeof newVNode !== 'object') {
      return oldVNode !== newVNode;
    }
  
    if (oldVNode.tag !== newVNode.tag) {
      return true;
    }
  
    for (const attr in oldVNode.attrs) {
      if (
        oldVNode.attrs.hasOwnProperty(attr) &&
        oldVNode.attrs[attr] !== newVNode.attrs[attr]
      ) {
        return true;
      }
    }
  
    for (const attr in newVNode.attrs) {
      if (
        newVNode.attrs.hasOwnProperty(attr) &&
        oldVNode.attrs[attr] !== newVNode.attrs[attr]
      ) {
        return true;
      }
    }
  
    if (oldVNode.children.length !== newVNode.children.length) {
      return true;
    }
  
    for (let i = 0; i < oldVNode.children.length; i++) {
      if (diff(oldVNode.children[i], newVNode.children[i])) {
        return true;
      }
    }
  
    return false;
  }
  
  function patch(domNode, oldVNode, newVNode) {
    const parentNode = domNode.parentNode;

    if (diff(oldVNode, newVNode)) {
      if (typeof newVNode === 'object') {
        const newDomNode = newVNode.render();
        parentNode.replaceChild(newDomNode, domNode);
        return newDomNode;
      } else {
        const newDomNode = document.createTextNode(newVNode);
        parentNode.replaceChild(newDomNode, domNode);
        return newDomNode;
      }
    }
  
    if (typeof oldVNode === 'object' && typeof newVNode === 'object') {
      DOM.updateElement(domNode, newVNode.attrs, oldVNode.attrs);
  
      const commonLength = Math.min(
        oldVNode.children.length,
        newVNode.children.length
      );
      for (let i = 0; i < commonLength; i++) {
        patch(domNode.childNodes[i], oldVNode.children[i], newVNode.children[i]);
      }
  
      // Remove extra old child nodes
      for (let i = newVNode.children.length; i < oldVNode.children.length; i++) {
        DOM.removeElement(domNode.childNodes[i]);
      }
  
      // Add extra new child nodes
      for (let i = oldVNode.children.length; i < newVNode.children.length; i++) {
        const newChild = newVNode.children[i];
        const newChildNode =
          typeof newChild === 'object' ? newChild.render() : newChild;
        DOM.createElement(domNode, {}, [newChildNode]);
      }
    }
  
    return domNode;
  }
  
  
  
  export { VNode, diff, patch };
  