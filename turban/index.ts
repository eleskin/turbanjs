let _selector: string = null;

export class Component {
	constructor() {
	}
	
	data = new Proxy({
		count: 0,
	}, {
		set: (target: any, prop: any, val: any, receiver: any) => {
			const oldDOM = this.DOM();
			const reflectSet = Reflect.set(target, prop, val, receiver);
			Turban.recreateDOM(oldDOM, this.DOM());
			return reflectSet;
		},
	});
	
	buttonHandleClick: Function = (): void => {
		this.data.count += 1;
	};
	
	DOM: any = () => ({
		element: 'div',
		attributes: {class: 'App'},
		children: [
			{
				element: 'button',
				handlers: {click: this.buttonHandleClick},
				attributes: {class: 'Button'},
				children: [{element: '#text', text: 'Click Me'}],
			},
			{
				element: 'span',
				children: [{element: '#text', text: this.data.count}],
			},
		],
	});
}

const deepEqual: Function = (oldDOM: any, DOM: any): boolean => {
	let result = true;
	for (const prop in DOM) {
		if (Array.isArray(DOM[prop]) && Array.isArray(oldDOM[prop])) {
			for (let i = 0; i < DOM[prop].length; i++) {
				result = deepEqual(oldDOM[prop][i], DOM[prop][i]);
			}
		} else if (typeof DOM[prop] === 'object' && typeof oldDOM[prop] === 'object') {
			result = deepEqual(oldDOM[prop], DOM[prop]);
		} else {
			if (DOM[prop] !== oldDOM[prop]) {
				result = false;
			}
		}
	}
	
	return result;
};

class Turban {
	static replaceDOMValues(oldVirtualDOM: any, virtualDOM: any): void {
		if (!oldVirtualDOM.isEqualNode(virtualDOM)) {
			for (let count = 0; count < virtualDOM.childNodes.length; count++) {
				if (!oldVirtualDOM.childNodes[count].isEqualNode(virtualDOM.childNodes[count])) {
					Turban.replaceDOMValues(oldVirtualDOM.childNodes[count], virtualDOM.childNodes[count]);
					oldVirtualDOM.childNodes[count].innerHTML = virtualDOM.childNodes[count].innerHTML;
				}
			}
		}
	}
	
	static recreateDOM(oldDOM: any, DOM: any): void {
		if (!deepEqual(oldDOM, DOM)) {
			const virtualDOM = Turban.createDOM(DOM);
			
			Turban.replaceDOMValues(document.querySelector('#app').children[0], virtualDOM);
		}
	}
	
	static createDOM(DOM: any): Element {
		const rootElement: Element = DOM.element !== '#text' ?
			document.createElement(DOM.element) :
			document.createTextNode(DOM.text);
		
		for (let attribute in DOM.attributes) {
			rootElement.setAttribute(attribute, DOM.attributes[attribute]);
		}
		
		for (let handler in DOM.handlers) {
			rootElement.addEventListener(handler, (event) => {
				DOM.handlers[handler](event);
			});
		}
		
		if (DOM.children) {
			for (let count = 0; count < DOM.children.length; count++) {
				rootElement.appendChild(this.createDOM(DOM.children[count]));
			}
		}
		
		return rootElement;
	}
}

export const render: Function = (selector: string, component: Component): void => {
	_selector = selector;
	const element: any = document.querySelector(selector);
	
	element.innerText = null;
	
	element.appendChild(Turban.createDOM(component.DOM()));
};