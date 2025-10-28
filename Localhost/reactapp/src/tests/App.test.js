import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

jest.mock("../services/api", () => ({
  getAllPlans: jest.fn(),
  getPlansByType: jest.fn(),
  getPlansSortedByPrice: jest.fn(),
  addPlan: jest.fn(),
  deletePlan: jest.fn(),
}));

import {
  getAllPlans,
  getPlansByType,
  getPlansSortedByPrice,
  addPlan,
  deletePlan,
} from "../services/api";

describe("App Component Tests", () => {
  const mockPlans = [
    { id: 1, planName: "Basic Pack", type: "Prepaid", price: 199, validity: 28, dataLimit: "1GB/day" },
    { id: 2, planName: "Premium Pack", type: "Postpaid", price: 499, validity: 30, dataLimit: "2GB/day" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- Basic Rendering ----------------
  test("renders header and description", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByText("Mobile Recharge Plan Manager")).toBeInTheDocument();
    expect(screen.getByText(/Manage prepaid/i)).toBeInTheDocument();
  });

  test("renders empty state when no plans", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [] });
    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText("Basic Pack")).not.toBeInTheDocument();
    });
  });

  test("renders list of plans", async () => {
    getAllPlans.mockResolvedValueOnce({ data: mockPlans });
    render(<App />);
    expect(await screen.findByText("Basic Pack")).toBeInTheDocument();
    expect(screen.getByText("Premium Pack")).toBeInTheDocument();
  });

  // ---------------- Add Plan ----------------
  test("adds a new plan via form", async () => {
    getAllPlans
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [...mockPlans, { id: 3, planName: "Super Pack", type: "Combo", price: 299, validity: 28, dataLimit: "1.5GB/day" }],
      });

    addPlan.mockResolvedValueOnce({});

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Plan Name"), { target: { value: "Super Pack" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Combo" } });
    fireEvent.change(screen.getByPlaceholderText("Price (₹)"), { target: { value: "299" } });
    fireEvent.change(screen.getByPlaceholderText("Validity (days)"), { target: { value: "28" } });
    fireEvent.change(screen.getByPlaceholderText("Data Limit"), { target: { value: "1.5GB/day" } });

    fireEvent.click(screen.getByText("Add Plan"));

    expect(await screen.findByText("Super Pack")).toBeInTheDocument();
  });

  test("reset form after adding plan", async () => {
    getAllPlans
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockPlans });

    addPlan.mockResolvedValueOnce({});
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Plan Name"), { target: { value: "Temp Plan" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Prepaid" } });
    fireEvent.change(screen.getByPlaceholderText("Price (₹)"), { target: { value: "100" } });
    fireEvent.change(screen.getByPlaceholderText("Validity (days)"), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText("Data Limit"), { target: { value: "500MB" } });

    fireEvent.click(screen.getByText("Add Plan"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Plan Name")).toHaveValue("");
    });
  });

  // ---------------- Delete Plan ----------------
  test("deletes a plan", async () => {
    getAllPlans
      .mockResolvedValueOnce({ data: mockPlans })
      .mockResolvedValueOnce({ data: [mockPlans[1]] });

    deletePlan.mockResolvedValueOnce({});

    render(<App />);
    expect(await screen.findByText("Basic Pack")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => expect(screen.queryByText("Basic Pack")).not.toBeInTheDocument());
  });

  // ---------------- Filtering ----------------
  test("filters plans by type", async () => {
    getAllPlans.mockResolvedValueOnce({ data: mockPlans });
    getPlansByType.mockResolvedValueOnce({ data: [mockPlans[0]] });

    render(<App />);
    fireEvent.change(await screen.findByDisplayValue("All Plans"), { target: { value: "Prepaid" } });

    expect(await screen.findByText("Basic Pack")).toBeInTheDocument();
    expect(screen.queryByText("Premium Pack")).not.toBeInTheDocument();
  });

  test("shows all plans when filter reset", async () => {
    getAllPlans.mockResolvedValueOnce({ data: mockPlans });
    render(<App />);
    fireEvent.change(await screen.findByDisplayValue("All Plans"), { target: { value: "all" } });
    expect(await screen.findByText("Basic Pack")).toBeInTheDocument();
    expect(screen.getByText("Premium Pack")).toBeInTheDocument();
  });

  // ---------------- Sorting ----------------
  test("sorts plans by price", async () => {
    getAllPlans.mockResolvedValueOnce({ data: mockPlans });
    getPlansSortedByPrice.mockResolvedValueOnce({ data: [...mockPlans].sort((a, b) => a.price - b.price) });

    render(<App />);
    fireEvent.click(await screen.findByText(/Sort by Price/i));

    expect(await screen.findByText("Basic Pack")).toBeInTheDocument();
  });

  // ---------------- Component Specific ----------------
  test("plan card displays details", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [mockPlans[0]] });
    render(<App />);
    expect(await screen.findByText("Type: Prepaid")).toBeInTheDocument();
    expect(screen.getByText(/₹199/)).toBeInTheDocument();
    expect(screen.getByText(/28 days/)).toBeInTheDocument();
  });

  test("form requires all fields", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [] });
    render(<App />);
    fireEvent.click(screen.getByText("Add Plan"));
    expect(await screen.findByText("Add New Plan")).toBeInTheDocument();
  });

  test("filter dropdown has correct options", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [] });
    render(<App />);
    const options = screen.getAllByRole("option").map((o) => o.textContent);
    expect(options).toEqual(["All Plans", "Prepaid", "Postpaid", "Data-only", "Combo"]);
  });

  test("sort button is visible", async () => {
    getAllPlans.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByText(/Sort by Price/)).toBeInTheDocument();
  });

  test("delete button is present for each plan", async () => {
    getAllPlans.mockResolvedValueOnce({ data: mockPlans });
    render(<App />);
    const deleteButtons = await screen.findAllByText("Delete");
    expect(deleteButtons.length).toBe(2);
  });
});
