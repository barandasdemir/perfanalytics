import 'bulma/css/bulma.min.css';
import './styles/WebsiteTable.css';
import Chart from 'react-bulma-chartjs';

function AnalyticsChart({ label, data }) {
  const labels = data.map((m) =>
    new Date(m.timestamp)
      .toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      .replaceAll('.', '/')
  );
  const dataset = data.map((m) => m.value);
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data: dataset,
        backgroundColor: 'rgba(46, 51, 63, 0.7)',
        borderColor: 'rgba(0, 209, 178, 0.3)',
      },
    ],
    options: {
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'month',
              unitStepSize: 1,
              displayFormats: {
                millisecond: 'MMM DD',
                second: 'MMM DD',
                minute: 'MMM DD',
                hour: 'MMM DD',
                day: 'MMM DD',
                week: 'MMM DD',
                month: 'MMM DD',
                quarter: 'MMM DD',
                year: 'MMM DD',
              },
            },
          },
        ],
      },
    },
  };

  return <Chart type="line" data={chartData} />;
}

export default AnalyticsChart;
