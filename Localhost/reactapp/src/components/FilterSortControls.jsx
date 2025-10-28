import React from "react";
import "./FilterSortControls.css";

const FilterSortControls = ({ onFilter, onSort }) => {
 return (
 <div className="controls">
 <select onChange={(e) => onFilter(e.target.value)}>
 <option value="all">All Plans</option>
 <option value="Prepaid">Prepaid</option>
 <option value="Postpaid">Postpaid</option>
 <option value="Data-only">Data-only</option>
 <option value="Combo">Combo</option>
 </select>

 <button onClick={onSort}>Sort by Price</button>
 </div>
 );
};

export default FilterSortControls;

