import React, { useState, useEffect } from 'react';
import { planAPI, adminAPI } from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    planName: '',
    price: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'plans':
          const plansData = await planAPI.getAllPlans();
          setPlans(plansData);
          break;
        case 'users':
          const usersData = await adminAPI.getAllUsers();
          setUsers(usersData);
          break;
        case 'subscriptions':
          const subscriptionsData = await adminAPI.getAllSubscriptions();
          setSubscriptions(subscriptionsData);
          break;
        case 'transactions':
          const transactionsData = await adminAPI.getAllTransactions();
          setTransactions(transactionsData);
          break;
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      await planAPI.addPlan({
        ...newPlan,
        price: parseFloat(newPlan.price),
        duration: parseInt(newPlan.duration)
      });
      setNewPlan({ planName: '', price: '', duration: '', description: '' });
      loadData();
    } catch (err) {
      setError('Failed to add plan');
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      await planAPI.updatePlan(editingPlan.planId, {
        ...editingPlan,
        price: parseFloat(editingPlan.price),
        duration: parseInt(editingPlan.duration)
      });
      setEditingPlan(null);
      loadData();
    } catch (err) {
      setError('Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await planAPI.deletePlan(planId);
        loadData();
      } catch (err) {
        setError('Failed to delete plan');
      }
    }
  };

  const renderPlansTab = () => (
    <div>
      <h3>Plan Management</h3>
      
      <form onSubmit={handleAddPlan} className="plan-form">
        <h4>Add New Plan</h4>
        <input
          type="text"
          placeholder="Plan Name"
          value={newPlan.planName}
          onChange={(e) => setNewPlan({...newPlan, planName: e.target.value})}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={newPlan.price}
          onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={newPlan.duration}
          onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={newPlan.description}
          onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
        />
        <button type="submit">Add Plan</button>
      </form>

      <div className="plans-list">
        {plans.map(plan => (
          <div key={plan.planId} className="plan-item">
            {editingPlan?.planId === plan.planId ? (
              <form onSubmit={handleUpdatePlan} className="edit-form">
                <input
                  type="text"
                  value={editingPlan.planName}
                  onChange={(e) => setEditingPlan({...editingPlan, planName: e.target.value})}
                />
                <input
                  type="number"
                  step="0.01"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                />
                <input
                  type="number"
                  value={editingPlan.duration}
                  onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})}
                />
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingPlan(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <h4>{plan.planName}</h4>
                <p>Price: ${plan.price}</p>
                <p>Duration: {plan.duration} days</p>
                <p>Description: {plan.description}</p>
                <button onClick={() => setEditingPlan(plan)}>Edit</button>
                <button onClick={() => handleDeletePlan(plan.planId)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      <h3>User Management</h3>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div>
      <h3>All Subscriptions</h3>
      <div className="subscriptions-list">
        {subscriptions.map(subscription => (
          <div key={subscription.subscriptionId} className="subscription-item">
            <p>Plan: {subscription.plan.planName}</p>
            <p>User: {subscription.user.email}</p>
            <p>Status: {subscription.status}</p>
            <p>Start: {subscription.startDate}</p>
            <p>End: {subscription.endDate}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div>
      <h3>All Transactions</h3>
      <div className="transactions-list">
        {transactions.map(transaction => (
          <div key={transaction.transactionId} className="transaction-item">
            <p>Amount: ${transaction.amount}</p>
            <p>Date: {new Date(transaction.transactionDate).toLocaleDateString()}</p>
            <p>Payment Method: {transaction.paymentMethod}</p>
            <p>Status: {transaction.status}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={activeTab === 'plans' ? 'active' : ''}
          onClick={() => setActiveTab('plans')}
        >
          Plans
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'subscriptions' ? 'active' : ''}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscriptions
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'plans' && renderPlansTab()}
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'subscriptions' && renderSubscriptionsTab()}
            {activeTab === 'transactions' && renderTransactionsTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;