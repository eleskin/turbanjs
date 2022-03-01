const List: Function = ({firstElement, secondElement}: {firstElement: string, secondElement: string}): string => {
	return `
		<ul class="list">
			<li>${firstElement}</li>
			<li>${secondElement}</li>
		</ul>
	`;
};

export default List;