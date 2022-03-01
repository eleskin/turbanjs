const _extractComponentsHTML: Function = (component: string): Element => {
	const FIRST_ELEMENT: number = 0;
	
	const elementsWrapper: Element = document.createElement('div');
	elementsWrapper.innerHTML = component;
	
	return elementsWrapper.children[FIRST_ELEMENT];
};

const _getChildren: Function = (element: Element) => {
	const children = [];
	
	for (let i = 0; i < element.childNodes.length; i++) {
		children.push(_buildVirtualNodes(element.childNodes[i]));
	}
	
	return children;
};

const _buildVirtualNodes: Function = (element: Element): Object => {
	const node: any = {};
	
	switch (element.nodeType) {
		case 1:
			node.tagName = element.tagName;
			if (!element.children.length) node.text = element.textContent;
			node.attributes = Array.from(element.attributes);
			if (element.childNodes.length) node.children = _getChildren(element);
			break;
		case 3:
			node.tagName = '#text';
			node.text = element.textContent;
			break;
		default:
			break;
	}
	
	return node;
};

const _buildVirtualDOM: Function = (element: Element): Object => {
	const rootElement: any = {
		tagName: element.tagName,
		children: [],
	};
	
	rootElement.children = _getChildren(element);
	
	return rootElement;
};

const render: Function = ({selector, component}: { selector: string, component: string }): void => {
	const element: Element = document.querySelector(selector);
	
	// _buildVirtualDOM(_extractComponentsHTML(component));
	console.log(_buildVirtualDOM(_extractComponentsHTML(component)));
	
	element.append(_extractComponentsHTML(component));
};

const useState: Function = (initialState: any): [typeof initialState, Function] => {
	let state: typeof initialState = initialState;
	
	const setNewState: Function = (initialState: any): typeof initialState => {
		if (initialState !== state) {
			state = initialState;
		}
	};
	
	return [() => state, setNewState];
};

export {render, useState};