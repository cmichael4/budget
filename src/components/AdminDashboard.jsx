import React, { useState, useEffect } from 'react';
import { db, ref, onValue, set } from '../firebase';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatsCard = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  
  h3 {
    margin: 0 0 8px 0;
    color: #2e7d32;
  }
  
  .value {
    font-size: 24px;
    font-weight: 600;
  }
`;

const VisitList = styled.div`
  margin-top: 20px;
  max-height: 500px;
  overflow-y: auto;
`;

const VisitCard = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  
  .timestamp {
    color: #666;
    font-size: 12px;
  }
  
  .location {
    font-weight: 500;
    margin: 8px 0;
    color: #2e7d32;
  }
  
  .details {
    font-size: 14px;
    color: #666;
    margin: 4px 0;
  }
`;

const AdminDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueLocations, setUniqueLocations] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing Firebase listeners");
    setLoading(true);
    
    const viewsRef = ref(db, 'pageViews');
    const visitsRef = ref(db, 'visits');

    // First get the view count
    onValue(viewsRef, (snapshot) => {
      console.log("Views count:", snapshot.val());
      if (!snapshot.exists()) {
        console.log("Views data doesn't exist, initializing...");
        set(viewsRef, 0).then(() => {
          console.log("Views initialized");
        });
      }
      setTotalViews(snapshot.val() || 0);
    });

    // Then get the visits
    onValue(visitsRef, (snapshot) => {
      console.log("Visits data:", snapshot.val());
      const data = snapshot.val();
      if (!data) {
        console.log("No visits data yet");
        setVisits([]);
        setUniqueLocations(new Set());
      } else {
        const visitsArray = Object.entries(data).map(([id, visit]) => ({
          id,
          ...visit,
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setVisits(visitsArray);
        
        const locations = new Set(
          visitsArray
            .filter(visit => visit.location?.city)
            .map(visit => `${visit.location.city}, ${visit.location.country}`)
        );
        setUniqueLocations(locations);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching visits:", error);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up Firebase listeners");
    };
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <h2>Analytics Dashboard</h2>
        <div>Loading analytics data...</div>
      </DashboardContainer>
    );
  }

  if (!visits.length && totalViews === 0) {
    return (
      <DashboardContainer>
        <h2>Analytics Dashboard</h2>
        <div>No analytics data available yet. Try refreshing the page a few times to generate some visits.</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h2>Analytics Dashboard</h2>
      
      <StatsCard>
        <h3>Total Views</h3>
        <div className="value">{totalViews}</div>
      </StatsCard>
      
      <StatsCard>
        <h3>Unique Locations</h3>
        <div className="value">{uniqueLocations.size}</div>
      </StatsCard>
      
      <h3>Recent Visits</h3>
      <VisitList>
        {visits.map(visit => (
          <VisitCard key={visit.id}>
            <div className="timestamp">
              {new Date(visit.timestamp).toLocaleString()}
            </div>
            {visit.location && (
              <div className="location">
                📍 {visit.location.city}, {visit.location.region}, {visit.location.country}
              </div>
            )}
            <div className="details">🌐 {visit.referrer}</div>
            <div className="details">💻 {visit.screenSize?.width}x{visit.screenSize?.height}</div>
            <div className="details">🌍 {visit.timezone}</div>
          </VisitCard>
        ))}
      </VisitList>
    </DashboardContainer>
  );
};

export default AdminDashboard; 