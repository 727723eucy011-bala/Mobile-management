import React, { useState, useEffect } from 'react';
import { planAPI, subscriptionAPI } from '../services/api';
import authService from '../services/authService';
import './Dashboard.css';

const UserDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, subscriptionsData] = await Promise.all([
        planAPI.getAllPlans(),
        subscriptionAPI.getUserSubscriptions(currentUser.userId)
      ]);
      setPlans(plansData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await subscriptionAPI.createSubscription(planId);
      loadData(); // Refresh data
    } catch (err) {
      setError('Failed to create subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await subscriptionAPI.cancelSubscription(subscriptionId);
      loadData(); // Refresh data
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <section className="plans-section">
        <h2>Available Plans</h2>
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.planId} className="plan-card">
              <h3>{plan.planName}</h3>
              <p className="price">${plan.price}</p>
              <p className="duration">{plan.duration} days</p>
              <p className="description">{plan.description}</p>
              <button 
                onClick={() => handleSubscribe(plan.planId)}
                className="subscribe-btn"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="subscriptions-section">
        <h2>My Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p>No subscriptions found.</p>
        ) : (
          <div className="subscriptions-list">
            {subscriptions.map(subscription => (
              <div key={subscription.subscriptionId} className="subscription-card">
                <h4>{subscription.plan.planName}</h4>
                <p>Status: <span className={`status ${subscription.status.toLowerCase()}`}>
                  {subscription.status}
                </span></p>
                <p>Start Date: {subscription.startDate}</p>
                <p>End Date: {subscription.endDate}</p>
                {subscription.status === 'ACTIVE' && (
                  <button 
                    onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;