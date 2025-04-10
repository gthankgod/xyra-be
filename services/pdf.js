const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateChartImage } = require('../utils/chart');

exports.createPDF = async (user) => {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(__dirname, '..', 'uploads', `${user._id}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Financial Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`User Email: ${user.email}`);
  doc.text(`Persona: ${user.persona}`);
  doc.moveDown().text(`Insights:\n${user.lastResponse}`);
  
  // const chartPath = await generateChartImage(user.answers);
  // doc.image(chartPath, { fit: [400, 300], align: 'center' });

  doc.end();
  return filePath;
};
