(() => {
  const trackerScript = document.querySelector("script[data-api-tracker]");
  if (!trackerScript || typeof window.ApiTracker !== "function") return;

  const projectId = trackerScript.dataset.projectId;
  const endpoint = trackerScript.dataset.endpoint;
  const environment = trackerScript.dataset.environment;
  const sessionId = sessionStorage.getItem("api_tracker_session");
  const tracker = window.ApiTracker({ projectId, endpoint, environment, sessionId });
  const offer = document.querySelector("#oferta");
  const viewedKey = `api_tracker_view_offer:${location.pathname}`;

  if (!offer || sessionStorage.getItem(viewedKey)) return;

  const markOfferViewed = () => {
    if (sessionStorage.getItem(viewedKey)) return;
    sessionStorage.setItem(viewedKey, "1");
    tracker.track("view_offer");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markOfferViewed();
          observer.disconnect();
        }
      }),
      { threshold: 0.35 },
    );
    observer.observe(offer);
  }
})();
