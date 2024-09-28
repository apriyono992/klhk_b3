import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generateRekomendasiB3Pdf() {
    // Resolve the path to the main EJS template
    const templatePath = path.resolve(__dirname, '../pdf/rekomendasiB3.html');

    // Read binary file (logo image) and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`; // Base64 string for the logo image

    // Read the template
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the EJS template and pass the base64 image to the template
    const renderedHtml = ejs.render(template, { base64Image }, {
      views: [path.resolve(__dirname, '../pdf')] // Ensure EJS looks for included files in the pdf folder
    });

    const browser = await puppeteer.launch({headless: 'shell'});
    const page = await browser.newPage();

    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensures that background colors are printed
      margin: {
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    });

    await browser.close();

    // Return the PDF buffer
    return pdfBuffer;
  }

  async generateRegistrasiB3Pdf() {
    // Resolve the path to the main EJS template
    const templatePath = path.resolve(__dirname, '../pdf/registrasiB3.html');

    // Read binary file (logo image) and convert it to base64
    const base64Logo = fs.readFileSync(path.resolve(__dirname, '../pdf/logo_klhk.png')).toString('base64');
    const base64Image = `data:image/png;base64,${base64Logo}`; // Base64 string for the logo image

    // Read the template
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the EJS template and pass the base64 image to the template
    const renderedHtml = ejs.render(template, { base64Image }, {
      views: [path.resolve(__dirname, '../pdf')] // Ensure EJS looks for included files in the pdf folder
    });

    const browser = await puppeteer.launch({headless: 'shell'});
    const page = await browser.newPage();

    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensures that background colors are printed
      margin: {
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    });

    await browser.close();

    // Return the PDF buffer
    return pdfBuffer;
  }
}
