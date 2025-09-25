import { useState } from "react";

const useSomeHook = (): [number, () => void] => {
	const [count, setCount] = useState<number>(0);

	const increment = () => {
		setCount(count + 1);
	};

	return [count, increment]
}

export default useSomeHook;