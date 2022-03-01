import List from './List';

import {useState} from './turban';

const App: Function = (): string => {
	const [firstElement, setFirstElement] = useState('First element');
	const [secondElement, setSecondElement] = useState('Second element');
	
	return (`
		<div>
			This is first Turban app
			${List({firstElement: firstElement(), secondElement: secondElement()})}
			</div>
	`);
};

export default App;