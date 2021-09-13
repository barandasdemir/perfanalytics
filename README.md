# PerfAnalytics

PerfAnalytics is an ecosystem which collects and criticizes web performance data. The ecosystem consists of 3 subsystem;

- [PerfAnalytics.Js](./lib)
- [PerfAnalytics.API](./server)
- [PerfAnalytics.Dashboard](./dashboard)

## PerfAnalytics.API

PerfAnalytics.API is a restful API which saves data, posted from PerfAnalytics.JS and returns time specific filtered data.

_Can be accessed at <https://barandasdemir-perfanalytics.herokuapp.com/api>_

### API Overview

PerfAnalytics.API uses Express.js and MongoDB under the hood. As it is built to be a RESTful API, there are 6 endpoints.

### API Usage

Website specific:

- GET /website - Get all registered websites
- POST /website/register - Register a new website
- DELETE /website/siteID - Delete a website (does not remove but orphans existing analytic data)

Analytic specific:

- GET /analytic - Get all collected analytic data
- GET /analytic/siteID - Get all collected analytic data of a specific website
- POST /analytic/siteID - Insert new analytic data for an existing website (there is one caviat to this endpoint: as perfanalytics.js uses `sendBeacon` API, requests to this endpoint must have `Content-type: text/plain` header set)

### Load Test

Used [loadtest](https://www.npmjs.com/package/loadtest#usage-dos) to test the `GET /api/website` endpoint.

- 200 requests per second
- Concurrency of 10

![image](https://user-images.githubusercontent.com/16290208/133086872-6951bc94-1e94-4899-a00a-2ad974af3520.png)

## perfanalytics.js

PerfAnalytics.JS is a lightweight client-side library, which collects some performance related key metrics from browser and sends to the PerfAnalytics.API.

Uses Rollup for bundling and providing a minified version automagically.

It relies on the following API's:

- [Performance Interface](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

Built files can be accessed at

<https://barandasdemir-perfanalytics.herokuapp.com/perfanalytics.js>

or at

<https://barandasdemir-perfanalytics.herokuapp.com/perfanalytics.min.js>

for a minified build.

![Build sizes](https://user-images.githubusercontent.com/16290208/133083366-81cf445a-833a-4f54-8c8c-7d592a707559.png)

### Library Usage

Add the preferred version to your website with

```html
<script
  src="https://barandasdemir-perfanalytics.herokuapp.com/perfanalytics.js"
  integrity="sha512-5T7eqnllTDshiVt6VuBMev+susiLJg7C1lKhavsYtIHtZhMGfTwiFyYPkGoJ11lnG01y2w96ea/DmubD/f2aFg=="
  crossorigin="anonymous"
></script>

<script
  src="https://barandasdemir-perfanalytics.herokuapp.com/perfanalytics.min.js"
  integrity="sha512-2p1zHoxNa+yoheS9yxue/X51sA5nzMXOcwnpryWyXrz9Ma2RzB/GyjDq1xdaKqdDVLu8bRlJDe0VwjPz0+B+wg=="
  crossorigin="anonymous"
></script>
```

**These script lines are subject to change when the library is updated.**

**Please see <https://barandasdemir-perfanalytics.herokuapp.com/sri.txt> for most updated usage.**

## PerfAnalytics Dashboard

PerfAnalytics.Dashboard is a dashboard which shows perf related metrics in a visualized way.

Uses PerfAnalytics.API to fetch analytic data and visualizes a website's TTFB, FCP, Dom Load, and Window Load measurements. Network timings for most other resources included.

![Dashboard Image 1](https://user-images.githubusercontent.com/16290208/133085044-fc809265-3d1a-4957-b3c6-b3d56cda765f.jpg)

![Dashboard Image 2](https://user-images.githubusercontent.com/16290208/133085209-7b57aa7e-0a78-4431-a798-c8d1c8b8ceb1.png)

## CI/CD

Used [node.js.yml](./github/workflows/node.js.yml) file to utilize GitHub Actions for continuous integration and delivery.

On every direct push or PR merge to `main` branch, Node.JS CI/CD workflow runs and if builds pass the ecosystem is pushed to and served via Heroku.
