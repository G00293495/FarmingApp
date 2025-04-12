import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./CostIncomePage.css";

const API_URL = "http://localhost:5000/cost-income"; 

const CostIncomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.type) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const response = await axios.post(API_URL, {
        type: formData.type.toLowerCase(),
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      setTransactions([response.data, ...transactions]);
      setFormData({ description: "", amount: "", type: "income" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expenseCategories = transactions.filter((t) => t.type === "cost").reduce((acc, t) => {
    acc[t.description] = (acc[t.description] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expenseCategories).map((category) => ({ name: category, value: expenseCategories[category] }));
  const COLORS = ["#FF8042", "#FFBB28", "#FF6384", "#36A2EB", "#4CAF50"];

  return (
    <div className="cost-income-container">
      <h2>Farm Cost and Income</h2>

      <div className="summary-box">
        <p><strong>Total Income:</strong> €{totalIncome.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> €{totalExpenses.toFixed(2)}</p>
        <p><strong>Balance:</strong> €{balance.toFixed(2)}</p>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="amount" placeholder="Amount (€)" value={formData.amount} onChange={handleChange} required />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="cost">Expense</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (€)</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.description}</td>
              <td>€{transaction.amount.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(transaction._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pieData.length > 0 && (
        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default CostIncomePage;