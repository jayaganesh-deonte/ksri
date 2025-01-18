import FingerprintJS from "@fingerprintjs/fingerprintjs";

const getBrowserInfo = () => {
  if (process.server) return {};

  const ua = navigator.userAgent;
  const browserInfo = {
    browser: "unknown",
    version: "unknown",
    os: "unknown",
    device: "desktop",
  };

  // Detect browser
  if (ua.includes("Firefox/")) {
    browserInfo.browser = "Firefox";
  } else if (ua.includes("Chrome/")) {
    browserInfo.browser = "Chrome";
  } else if (ua.includes("Safari/")) {
    browserInfo.browser = "Safari";
  } else if (ua.includes("Edge/")) {
    browserInfo.browser = "Edge";
  }

  // Detect OS
  if (ua.includes("Windows")) {
    browserInfo.os = "Windows";
  } else if (ua.includes("Mac OS")) {
    browserInfo.os = "MacOS";
  } else if (ua.includes("Linux")) {
    browserInfo.os = "Linux";
  } else if (ua.includes("Android")) {
    browserInfo.os = "Android";
    browserInfo.device = "mobile";
  } else if (ua.includes("iPhone") || ua.includes("iPad")) {
    browserInfo.os = "iOS";
    browserInfo.device = "mobile";
  }

  return browserInfo;
};

const generateVisitorId = async () => {
  if (process.server) return null;
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};

const getClientIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting IP:", error);
    return null;
  }
};

const trackVisitor = async () => {
  // Skip tracking on server-side
  if (process.server) return;

  let visitor = reactive({
    id: "",
    isFirstTime: false,
  });

  const storedVisitorId = localStorage.getItem("visitorId");
  const lastVisitDate = localStorage.getItem("lastVisitDate");
  const firstVisitDate = localStorage.getItem("firstVisitDate");

  let currentVisitorId = storedVisitorId;

  // New visitor
  if (currentVisitorId === null) {
    currentVisitorId = await generateVisitorId();
    localStorage.setItem("visitorId", currentVisitorId);
    localStorage.setItem("firstVisitDate", new Date().toISOString());
    visitor.isFirstTime = true;
  }

  // Update last visit date
  localStorage.setItem("lastVisitDate", new Date().toISOString());
  visitor.id = currentVisitorId || "";

  // Gather visitor information
  const browserInfo = getBrowserInfo() as {
    browser: string;
    version: string;
    os: string;
    device: string;
  };
  const clientIP = await getClientIP();

  // Prepare visitor data
  const visitorData = {
    visitor_id: currentVisitorId || "",
    ip_address: clientIP,
    is_first_time: visitor.isFirstTime,
    timestamp: new Date().toISOString(),
    first_visit_date: firstVisitDate || new Date().toISOString(),
    last_visit_date: lastVisitDate,
    current_visit_date: new Date().toISOString(),
    browser: browserInfo.browser,
    browser_version: browserInfo.version,
    operating_system: browserInfo.os,
    device_type: browserInfo.device,
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    referrer: document.referrer || "direct",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    window_size: `${window.innerWidth}x${window.innerHeight}`,
    page_url: window.location.href,
    route: useRoute().fullPath,
  };

  return visitorData;
};

export { trackVisitor };
