import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = () => {
  ReactGA.initialize('G-QK0C3EZ274', {
    testMode: process.env.NODE_ENV === 'development',
    debug: true,
    gaOptions: {
      send_page_view: true
    }
  });
};

// Track page views
export const trackPageView = (path) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: path,
    title: document.title
  });
};

// Track specific events
export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    nonInteraction: false
  });
};

// Track user interactions with specific features
export const trackFeatureUsage = (featureName, action) => {
  trackEvent('Feature Usage', action, featureName);
};

// Track form submissions
export const trackFormSubmission = (formName, success) => {
  trackEvent('Form Submission', success ? 'Success' : 'Failure', formName);
};

// Track calculator usage
export const trackCalculatorUsage = (action, details) => {
  trackEvent('Calculator', action, details);
};

// Track budget updates
export const trackBudgetUpdate = (action, category) => {
  trackEvent('Budget Update', action, category);
};

// Track user engagement
export const trackEngagement = (action, details) => {
  trackEvent('User Engagement', action, details);
}; 