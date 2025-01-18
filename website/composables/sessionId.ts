// Generate a random session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Get or create session ID
const getSessionId = () => {
  if (process.server) return { sessionId: null, isFirstTime: false };

  let sessionId = sessionStorage.getItem("visitor_session_id");
  let isFirstTime = false;
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("visitor_session_id", sessionId);
    isFirstTime = true;
  }
  return {
    sessionId,
    isFirstTime,
  };
};

// Get browser metadata
const getMetadata = () => {
  if (process.server) return {};

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || "direct",
    timestamp: new Date().toISOString(),
  };
};

// const runtimeConfig = useRuntimeConfig();

// const apiUrl = runtimeConfig.public.API_URL + "/public/visitorCount";

//   getSessionId
const trackSession = async () => {
  if (process.server) return;

  const { sessionId, isFirstTime } = getSessionId();
  const metadata = getMetadata();

  const data = {
    sessionId,
    isFirstTime,
    ...metadata,
  };

  return data;
};

export { trackSession };
