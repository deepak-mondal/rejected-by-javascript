import { useState, useTransition } from "react";

function FilterableList({ items }) {
	const [isPending, startTransition] = useTransition();
	const [filter, setFilter] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);

	function handleFilterChange(e) {
		const value = e.target.value;
		// Urgent update: instantly update the input field
		setFilter(value);

		// Non-urgent update: start the filtering in a transition
		startTransition(() => {
			// This is a "slow" update that will be performed in the background
			setFilteredItems(items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())));
		});
	}

	return (
		<div>
			<input title="input" type="text" value={filter} onChange={handleFilterChange} />
			{isPending && <div>Loading...</div>}
			<ul>
				{filteredItems.map((item, index) => (
					<li key={index}>{item.name}</li>
				))}
			</ul>
		</div>
	);
}

export default FilterableList
