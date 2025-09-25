import { useState } from "react";

const Form = () => {
	const [inputString, setInputString] = useState<string>("");
	const [list, setList] = useState<string[]>([]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputString.trim().length < 1) {
			setInputString("");
			return;
		}
		setList([...list, inputString]);
		setInputString("");
	};

	return (
		<form onSubmit={handleSubmit} data-testid="form">
			<input aria-label="enter-todos" onChange={(e) => setInputString(e.target.value)} value={inputString} data-testid="input-box"/>
			<button type="submit" data-testid="button">Add</button>
			{list.map((item, index) => {
				return <div key={"todo" + index} data-testid="list-items">{item}</div>;
			})}
			<select data-testid="select-box" aria-label="select-todos">
				<option data-testid="option">text 1</option>
				<option data-testid="option">text 2</option>
				<option data-testid="option">text 3</option>
				<option data-testid="option">text 4</option>
			</select>
		</form>
	);
};

export default Form;
