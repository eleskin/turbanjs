import {Component} from '../turban';

export default class App extends Component {
	data = this.createStore({
		count: 0,
		text: '',
	});
	
	buttonHandleClick: Function = (): void => {
		this.data.count += 1;
	};
	
	buttonHandleInput: Function = (event: any): void => {
		this.data.text = event.target.value;
	};
	
	DOM(): any {
		return {
			element: 'div',
			attributes: {class: 'App'},
			children: [
				{
					element: 'input',
					handlers: {input: this.buttonHandleInput},
				},
				{
					element: 'span',
					children: [{element: '#text', text: this.data.text}],
				},
				{
					element: 'br',
				},
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
		};
	}
}
