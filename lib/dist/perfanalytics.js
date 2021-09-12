(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  const _perfAnalytics = {
    isAPIAvailable: () => !!window.performance
      && !!window.performance.getEntriesByType
      && !!window.performance.getEntriesByName
      && !!navigator
      && typeof navigator.sendBeacon === 'function'
      && typeof fetch === 'function',
    siteID: null,
    ttfb: null,
    fcp: null,
    domLoad: null,
    windowLoad: null,
    resources: [],
  };

  const baseUrl = 'https://barandasdemir-perfanalytics.herokuapp.com';
  const msToSecond = (sec) => sec / 1000;

  if (_perfAnalytics.isAPIAvailable()) {
    const { timing } = window.performance.toJSON();
    fetch(`${baseUrl}/website/register`, {
      method: 'POST',
      body: JSON.stringify({
        origin: window.location.origin,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((data) => data.json())
      .then((response) => {
        _perfAnalytics.siteID = response.data.id;

        const [fcp] = window.performance.getEntriesByName('first-contentful-paint');
        _perfAnalytics.fcp = msToSecond(fcp.startTime);

        _perfAnalytics.ttfb = msToSecond(timing.responseStart - timing.requestStart);
        _perfAnalytics.domLoad = msToSecond(timing.domContentLoadedEventEnd - timing.navigationStart);
        _perfAnalytics.windowLoad = msToSecond(Date.now() - timing.navigationStart);

        const resources = window.performance.getEntriesByType('resource');
        _perfAnalytics.resources = resources
          .filter((resource) => resource.initiatorType !== 'fetch')
          .map((resource) => ({
            name: resource.name,
            duration: msToSecond(resource.responseEnd - resource.requestStart),
            size: resource.decodedBodySize,
          }));
      });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        navigator.sendBeacon(
          `${baseUrl}/analytic/${_perfAnalytics.siteID}`,
          JSON.stringify(_perfAnalytics),
        );
      }
    });
  }

})));
