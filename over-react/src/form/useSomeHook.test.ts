import { renderHook } from "@testing-library/react";
import useSomeHook from "./useSomeHook";
import { act } from "react";

describe("useSomeHook tests", () => {
	it("should initialize count to 0", () => {
		const { result, rerender } = renderHook(() => useSomeHook());
		const [value, increment] = result.current;
		expect(value).toBe(0);

		increment()
		rerender()
		expect(result.current[0]).toBe(1)
	});
});