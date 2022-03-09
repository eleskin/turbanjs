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
		this.data.count += 0;
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

class Turban {
	static recreateDOM(oldDOM: any, DOM: any) {
	}
	
	static createDOM(DOM: any) {
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
	const element: Element = document.querySelector(selector);
	
	element.appendChild(Turban.createDOM(component.DOM()));
};