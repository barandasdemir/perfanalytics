(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  // Copyright (C) 2021 Baran Dasdemir
  //
  // This file is part of perfanalytics.
  //
  // perfanalytics is free software: you can redistribute it and/or modify
  // it under the terms of the GNU General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.
  //
  // perfanalytics is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU General Public License for more details.
  //
  // You should have received a copy of the GNU General Public License
  // along with perfanalytics.  If not, see <http://www.gnu.org/licenses/>.

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

    window.onload = () => {
      navigator.sendBeacon(
        `${baseUrl}/analytic/${_perfAnalytics.siteID}`,
        JSON.stringify(_perfAnalytics),
      );
    };
  }

})));
