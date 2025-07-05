import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JobListService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadMultipleJobImages(
    jobId: string,
    userId: string,
    imageData: Array<{ title: string; description?: string }>,
    images: Express.Multer.File[],
  ) {
    // 1. Validate image data
    if (images.length !== imageData.length) {
      return {
        success: false,
        message: 'Number of images does not match number of imageData entries',
      };
    }

    const jobData = await this.prisma.jobs.findUnique({
      where: { id: jobId },
    });

    // 2. Generate PDF
    const pdfDir = './public/storage/inspection-pdf';
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `${jobId}.pdf`);
    const doc = new PDFDocument({
      size: [595.28, 1000],
      margins: { top: 50, bottom: 0, left: 50, right: 50 }, // bottom margin = 0
    });

    doc.pipe(fs.createWriteStream(pdfPath));

    // Helper function to draw the header
    function drawHeader(doc, jobData) {
      const pageWidth = doc.page.width;
      const x = (pageWidth - 100) / 2;
      doc.image('./public/storage/pdf-pictures/Art-Neidich.png', x, 20, {
        width: 100,
        height: 50,
      });
      // Ensure text starts below the logo to avoid overlap
      doc.y = 80;
      doc.fontSize(10).text('www.artneidich.com', { align: 'center' });
      doc.fontSize(10).text('A division of Lone Star Building Inspection, Inc.', { align: 'center' });
      doc.fontSize(10).text(`Attachment to FHA form # ${jobData.fha_number}`, { align: 'center' });
      doc.moveDown();
      doc.font('Helvetica-Bold').fontSize(10).text(`Date of Inspection : ${new Date().toLocaleDateString()}`, { align: 'left' });
      doc.y += 2;
      doc.font('Helvetica-Bold').fontSize(10).text(`Subject Property : ${jobData.address}`, { align: 'left' });
      doc.y += 2;
      doc.font('Helvetica-Bold').fontSize(10).text(`Subject Property : ${jobData.address}`, { align: 'left' });
      doc.y += 10;
    }

    // Add Footer function (for page number and footer image)
    function addFooter(doc, pageNumber: number) {
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Draw the line at the top of the footer
      doc.moveTo(50, pageHeight - 60)  // Move Y position to where the line should start
        .lineTo(pageWidth - 50, pageHeight - 60)
        .stroke();  // This adds the line at the top of the footer

      // Footer Image (logos)
      const logoWidth = 30; // Width of each logo
      const logoHeight = 30; // Height of each logo
      const leftLogoX = 50; // X coordinate for left logo
      const rightLogoX = pageWidth - logoWidth - 50; // X coordinate for right logo

      // Place the logos
      doc.image('./public/storage/pdf-pictures/footerlogo.png', leftLogoX, pageHeight - 50, { width: logoWidth, height: logoHeight });
      doc.image('./public/storage/pdf-pictures/footerlogo.png', rightLogoX, pageHeight - 50, { width: logoWidth, height: logoHeight });

      // Footer Text (centered between the logos)
      const text = 'All utilities are on and tested unless otherwise noted';
      const secondText = 'TREC Lic. # 10546 | TSBPE Lic. # I-3836 | Code Enforcement Lic. # 7055 | HUD-FHA Fee Reg.# D683 & 203K – D0931';

      // Calculate the width of the text
      const textWidth = doc.widthOfString(text);
      const textX = (pageWidth - textWidth) / 2; // Center the text horizontally

      // Add the first line of footer text
      doc.fontSize(8).text(text, textX, pageHeight - 45, { align: 'center' });

      // Calculate the width for the second text and center it as well
      const secondTextWidth = doc.widthOfString(secondText);
      const secondTextX = (pageWidth - secondTextWidth) / 2; // Center the second line of text

      // Add the second line of footer text
      doc.fontSize(7).text(secondText, secondTextX, pageHeight - 35, { align: 'center' }); // Slightly smaller second line

      // Page number (right-aligned)
      doc.fontSize(8).text(`Page ${pageNumber}`, pageWidth - 50, pageHeight - 30, { align: 'right' });
    }

    // Draw header on the first page
    drawHeader(doc, jobData);

    // Draw header on every new page
    doc.on('pageAdded', () => {
      drawHeader(doc, jobData);
    });

    // Add images with titles/descriptions (two per page)
    let imageIndex = 0;
    let pageNumber = 1;
    const imageWidth = 300;  // Width of each image
    const imageHeight = 300; // Height of each image
    const marginTop = 170;   // Y-start after the header
    const verticalGap = 30;  // Gap between two images on one page
    const titleGap = 5;      // Gap between an image and its title

    while (imageIndex < images.length) {
      // Current Y coordinate reset for each new page
      let currentY = marginTop;
      const centerX = (doc.page.width - imageWidth) / 2;

      // ---------- first image ----------
      doc.image(images[imageIndex].path, centerX, currentY, {
        width: imageWidth,
        height: imageHeight,
      });
      doc.fontSize(10).text(
        imageData[imageIndex].title,
        centerX,
        currentY + imageHeight + titleGap,
        { align: 'center', width: imageWidth },
      );
      imageIndex++;

      // Advance Y to position the second image (if any)
      currentY += imageHeight + titleGap + verticalGap;

      // ---------- second image (if available) ----------
      if (imageIndex < images.length) {
        doc.image(images[imageIndex].path, centerX, currentY, {
          width: imageWidth,
          height: imageHeight,
        });
        doc.fontSize(10).text(
          imageData[imageIndex].title,
          centerX,
          currentY + imageHeight + titleGap,
          { align: 'center', width: imageWidth },
        );
        imageIndex++;
      }

      // ---------- footer ----------
      addFooter(doc, pageNumber);
      pageNumber++;

      // If more images remain, add a new page (header will be drawn automatically by listener)
      if (imageIndex < images.length) {
        doc.addPage();
      }
    }

    // Finalize the PDF
    doc.end();

    return { success: true, message: 'Job Inspection PDF created successfully.', pdfPath };
  }
}
