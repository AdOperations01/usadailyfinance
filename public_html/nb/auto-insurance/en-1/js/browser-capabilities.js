/**
 * Browser Capabilities - Script for collecting and sending browser capabilities data
 * 
 * This script collects various browser capabilities and features and posts them
 * to the server for analytics and tracking purposes.
 */

/**
 * Get browser capabilities including device info, browser features, and network details
 * @returns {Object} Object containing collected browser capabilities
 */
async function getBrowserCapabilities() {
  const { userAgent, language, cookieEnabled, platform } = navigator;
  const { width: screenWidth, height: screenHeight, colorDepth } = screen;
  const screenResolution = `${screenWidth}x${screenHeight}`;
  const browserOnline = navigator.onLine;
  const doNotTrack = navigator.doNotTrack;
  const features = {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webWorkers: 'Worker' in window,
    geolocation: 'geolocation' in navigator,
    webRTC: 'RTCPeerConnection' in window,
    notifications: 'Notification' in window && Notification.permission !== 'denied',
  };

  const capabilities = {
    userAgent,
    language,
    cookiesEnabled: cookieEnabled,
    platform,
    screenWidth,
    screenHeight,
    screenResolution,
    colorDepth,
    browserOnline,
    doNotTrack,
    features,
  };

  if (navigator.connection) {
    const { effectiveType, downlink, rtt, saveData } = navigator.connection;
    capabilities.network = { effectiveType, downlink, rtt, saveData };
  }

  if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
    const ua = await navigator.userAgentData.getHighEntropyValues([
      'architecture',
      'model',
      'platform',
      'platformVersion',
      'fullVersionList',
    ]);
    Object.keys(ua).forEach((key) => {
      capabilities[key] = ua[key];
    });
  }

  capabilities.isMobile = navigator.userAgent.includes('Mobile');

  return capabilities;
}

/**
 * Post browser capabilities to the endpoint
 * @param {string} endpoint - The API endpoint to post capabilities to
 * @param {Object} capabilities - The capabilities to post
 * @param {number} retries - Number of retries on failure
 * @returns {Promise<void>}
 */
async function postBrowserCapabilities(endpoint, capabilities, retries = 5) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(capabilities),
    });

    if (!response.ok) {
      if (response.status === 404 && retries > 0) {
        console.log(`Retrying (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
        return postBrowserCapabilities(endpoint, capabilities, retries - 1);
      }
      throw new Error('Failed to post capabilities');
    }

    console.log('Capabilities posted successfully');
  } catch (error) {
    console.error('Error posting capabilities:', error);
  }
}

/**
 * Initialize browser capabilities collection and posting
 * @param {string} endpoint - The API endpoint to post capabilities to
 */
async function initBrowserCapabilities(endpoint) {
  if (!endpoint) {
    console.error('Browser capabilities endpoint not provided');
    return;
  }

  try {
    const capabilities = await getBrowserCapabilities();
    await postBrowserCapabilities(endpoint, capabilities);
  } catch (error) {
    console.error('Error initializing browser capabilities:', error);
  }
}

// Expose the API
window.browserCapabilities = {
  init: initBrowserCapabilities,
  get: getBrowserCapabilities,
  post: postBrowserCapabilities
};
