import React, { useState } from "react";
import { addPlan } from "../services/api";
import "./PlanForm.css";

const PlanForm = ({ onAdd }) => {
 const [plan, setPlan] = useState({
 planName: "",
 type: "",
 price: "",
 validity: "",
 dataLimit: ""
 });

 const handleChange = (e) => {
 setPlan({ ...plan, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 await addPlan(plan);
 setPlan({ planName: "", type: "", price: "", validity: "", dataLimit: "" });
 onAdd();
 };

 return (
 <form className="plan-form" onSubmit={handleSubmit}>
 <h2>Add New Plan</h2>
 <input type="text" name="planName" placeholder="Plan Name"
 value={plan.planName} onChange={handleChange} required />
 
 <select name="type" value={plan.type} onChange={handleChange} required>
 <option value="">Select Type</option>
 <option value="Prepaid">Prepaid</option>
 <option value="Postpaid">Postpaid</option>
 <option value="Data-only">Data-only</option>
 <option value="Combo">Combo</option>
 </select>

 <input type="number" name="price" placeholder="Price (₹)"
 value={plan.price} onChange={handleChange} required />

 <input type="number" name="validity" placeholder="Validity (days)"
 value={plan.validity} onChange={handleChange} required />

 <input type="text" name="dataLimit" placeholder="Data Limit"
 value={plan.dataLimit} onChange={handleChange} required />

 <button type="submit">Add Plan</button>
 </form>
 );
};

export default PlanForm;

