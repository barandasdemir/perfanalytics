import 'bulma/css/bulma.min.css';
import '@creativebulma/bulma-collapsible/dist/css/bulma-collapsible.min.css';
import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import './styles/Website.css';
import { useRef, useEffect, useState } from 'react';
import { Button, Columns, Form, Heading } from 'react-bulma-components';
import { getWebsiteAnalytics } from '../api';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
import AnalyticsChart from './AnalyticsChart';
import Metric from './Metric';

function attachTimeDate() {
  bulmaCalendar.attach('[type="date"]', {
    type: 'datetime',
    dateFormat: 'dd/MM/yyyy',
    displayMode: 'dialog',
    validateLabel: 'Select',
    showClearButton: false,
    showTodayButton: false,
    weekStart: 1,
    isRange: true,
    closeOnSelect: true,
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now()),
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    endTime: new Date(Date.now()),
  });
}

function getMetricDataset(metrics, key) {
  if (metrics.length > 1) {
    return metrics.map((m) => ({ timestamp: new Date(m.createdAt), value: m[key] }));
  }
  return [];
}

function Website({ data: { domain, id }, onDelete }) {
  const pickerRef = useRef(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    getWebsiteAnalytics(id, Date.now() - 30 * 60 * 1000, Date.now()).then((data) => {
      setAnalytics(data);
      attachTimeDate();
      pickerRef.current.bulmaCalendar.on('select', (picker) => {
        const { date, time } = picker.data;
        const start = date.start;
        const end = date.end;
        start.setHours(time.start.getHours(), time.start.getMinutes());
        end.setHours(time.end.getHours(), time.end.getMinutes());
        getWebsiteAnalytics(id, start.getTime(), end.getTime()).then((data) => {
          setAnalytics(data);
        });
      });
    });
  }, [id]);

  return (
    <div id="accordion">
      <article className="message">
        <div className="message-header">
          <Columns multiline={false}>
            <Columns.Column display="flex" alignItems="center">
              <p>{domain}</p>
            </Columns.Column>
            <Columns.Column display="flex" alignItems="center">
              <p>{id}</p>
            </Columns.Column>
            <Columns.Column textAlign="right">
              <a className="button is-primary mr-3" href={`#site-${id}`} data-action="collapse">
                Toggle details
              </a>
              <Button color="danger" onClick={() => onDelete(id)}>
                Delete
              </Button>
            </Columns.Column>
          </Columns>
        </div>
        <div
          id={`site-${id}`}
          className="message-body is-collapsible"
          data-parent="accordion"
          data-allow-multiple="true"
        >
          <div className="message-body-content">
            <Columns>
              <Columns.Column size={6} offset={3}>
                <Form.Input type="date" domRef={pickerRef}></Form.Input>
              </Columns.Column>
            </Columns>

            <Columns>
              <Columns.Column>
                <AnalyticsChart label="TTFB" data={getMetricDataset(analytics, 'ttfb')} />
                <AnalyticsChart label="DOM Load" data={getMetricDataset(analytics, 'domLoad')} />
              </Columns.Column>
              <Columns.Column>
                <AnalyticsChart label="FCP" data={getMetricDataset(analytics, 'fcp')} />
                <AnalyticsChart
                  label="Window Load"
                  data={getMetricDataset(analytics, 'windowLoad')}
                />
              </Columns.Column>

              <Columns.Column>
                <Heading textColor="grey">Resources</Heading>
                <div className="resourceContainer">
                  {analytics.map((a, idx) => (
                    <Metric
                      data={{ id: a.id, createdAt: a.createdAt, resources: a.resources }}
                      key={idx}
                    />
                  ))}
                </div>
              </Columns.Column>
            </Columns>
          </div>
        </div>
      </article>
    </div>
  );
}
export default Website;
