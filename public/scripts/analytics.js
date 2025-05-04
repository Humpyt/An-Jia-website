// Simple analytics script that will be loaded lazily
(function() {
  // Only run in production
  if (window.location.hostname === 'localhost') return;
  
  // Simple page view tracking
  function trackPageView() {
    const data = {
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, you would send this data to your analytics endpoint
    console.log('Analytics data:', data);
  }
  
  // Track page view on load
  trackPageView();
  
  // Track page view on navigation (for SPA)
  let lastPath = window.location.pathname;
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView();
    }
  }, 1000);
})();
