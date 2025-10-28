import React from "react";
import { deletePlan } from "../services/api";
import "./PlanList.css";

const PlanList = ({ plans, onDelete }) => {
 return (
 <div className="plan-list">
 {plans.map((plan) => (
 <div className="plan-card" key={plan.id}>
 <h3>{plan.planName}</h3>
 <p><strong>Type:</strong> {plan.type}</p>
 <p><strong>Price:</strong> ₹{plan.price}</p>
 <p><strong>Validity:</strong> {plan.validity} days</p>
 <p><strong>Data:</strong> {plan.dataLimit}</p>
 <button onClick={() => onDelete(plan.id)}>Delete</button>
 </div>
 ))}
 </div>
 );
};

export default PlanList;

