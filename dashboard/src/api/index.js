import axios from 'axios';

const defaultOpts = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export async function getWebsites() {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE}/website`, defaultOpts);
    const { success, data } = response.data;
    return success ? data : [];
  } catch (error) {
    console.error('PerfAnalytics Dashboard: Failed to fetch websites.');
    console.error(error?.message);
  }
}

export async function getWebsiteAnalytics(
  websiteID,
  start = Date.now() - 30 * 60 * 1000,
  end = Date.now()
) {
  if (!websiteID || websiteID === '') {
    return [];
  }
  try {
    const query = `?start=${start}&end=${end}`;
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE}/analytic/${websiteID}${query}`,
      defaultOpts
    );
    const {
      success,
      data: { analytics },
    } = response.data;
    return success ? analytics : [];
  } catch (error) {
    console.error(`PerfAnalytics Dashboard: Failed to fetch analytics for '${websiteID}'.`);
    console.error(error?.message);
  }
}

export async function deleteWebsite(websiteID) {
  if (!websiteID || websiteID === '') {
    return;
  }
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE}/website/${websiteID}`,
      defaultOpts
    );
    return response.status === 200;
  } catch (error) {
    console.error(`PerfAnalytics Dashboard: Failed to delete website '${websiteID}'.`);
    console.error(error?.message);
  }
}
