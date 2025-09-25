import Form from "./Form";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Form tests", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render all components", async () => {
		render(<Form />);

		const formWrapper = screen.getByTestId("form");
		const inputBox = screen.getByTestId("input-box");
		const button = screen.getByTestId("button");
		const list = screen.queryAllByTestId("list-items");

		expect(formWrapper).toBeInTheDocument();
		expect(inputBox).toBeInTheDocument();
		expect(button).toBeInTheDocument();
		expect(list.length).toBe(0);
	});

	it("should be able to type in the input box", () => {
		const { container } = render(<Form />);

		const inputBox = screen.getByTestId("input-box");
		const button = screen.getByTestId("button");

		expect(inputBox).toBeInTheDocument();
		expect(button).toBeInTheDocument();

		fireEvent.change(inputBox, { target: { value: "test" } });
		expect(inputBox).toHaveValue("test");

		expect(container).toMatchSnapshot();
	});

	it("select test", () => {
		render(<Form />);
		const select = screen.getByTestId("select-box");

		expect(select).toBeInTheDocument();
		fireEvent.click(select);
		const options = screen.getAllByTestId("option");
		const [selectedOption] = options;
		fireEvent.change(select, { target: { value: selectedOption.innerHTML } });
		expect(select).toHaveValue(selectedOption.innerHTML);
	});
});
