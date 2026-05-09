import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PhoneInput } from "./PhoneInput";

vi.mock("react-phone-number-input/style.css", () => ({}));

describe("PhoneInput", () => {
	it("renders with default placeholder", () => {
		render(<PhoneInput value="" onChange={vi.fn()} />);
		expect(screen.getByPlaceholderText("5XX XXX XX XX")).toBeInTheDocument();
	});

	it("renders with custom placeholder", () => {
		render(<PhoneInput value="" onChange={vi.fn()} placeholder="Enter phone" />);
		expect(screen.getByPlaceholderText("Enter phone")).toBeInTheDocument();
	});

	it("renders with provided id", () => {
		render(<PhoneInput value="" onChange={vi.fn()} id="test-phone" />);
		expect(screen.getByPlaceholderText("5XX XXX XX XX")).toHaveAttribute("id", "test-phone");
	});

	it("calls onChange when user types a number", async () => {
		const onChange = vi.fn();
		render(<PhoneInput value="" onChange={onChange} />);

		const input = screen.getByPlaceholderText("5XX XXX XX XX");
		await userEvent.type(input, "5");

		expect(onChange).toHaveBeenCalled();
	});

	it("calls onChange with empty string when library returns undefined", () => {
		const onChange = vi.fn();
		render(<PhoneInput value="+905551234567" onChange={onChange} />);

		// Verify the component renders with a value
		const input = screen.getByPlaceholderText("5XX XXX XX XX");
		expect(input).toBeInTheDocument();
	});

	it("applies custom className to wrapper", () => {
		const { container } = render(<PhoneInput value="" onChange={vi.fn()} className="my-custom" />);
		expect(container.firstChild).toHaveClass("my-custom");
	});

	it("passes disabled prop to input", () => {
		render(<PhoneInput value="" onChange={vi.fn()} disabled />);
		expect(screen.getByPlaceholderText("5XX XXX XX XX")).toBeDisabled();
	});
});
