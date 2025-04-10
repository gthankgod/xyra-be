// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

exports.generateChartImage = async (answers) => {
  const width = 400;
  const height = 300;
//   const canvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: 'bar',
    data: {
      labels: answers.map((_, i) => `Q${i + 1}`),
      datasets: [{
        label: 'Responses',
        data: answers,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }]
    },
  };

//   const buffer = await canvas.renderToBuffer(configuration);
  const imagePath = path.join(__dirname, '..', 'uploads', 'chart.png');
  fs.writeFileSync(imagePath, buffer);
  return imagePath;
};
