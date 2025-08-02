import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JobListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendInspectionPDF(
    jobId: string,
    userId: string
  ) {

    const jobData = await this.prisma.jobs.findUnique({
      where: { id: jobId },
      include: { areas: { include: { images: true } } }, // fetch areas and images
    });
  
    if (!jobData) throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    
    if (jobData.inspector_id !== userId) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }
    
    const selectedAreas = jobData.areas;


    if (selectedAreas.length === 0) throw new HttpException('No areas found', HttpStatus.NOT_FOUND);

    // ✅ 3. Get all images from selected areas
    const allImages = selectedAreas.flatMap(area => area.images);

    if (allImages.length === 0) throw new HttpException('No images found', HttpStatus.NOT_FOUND);

    // ✅ 4. Prepare PDF path
    const pdfDir = './public/storage/inspection-pdf';
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join( `${jobId}.pdf`);

    const doc = new PDFDocument({
      size: [595.28, 1000],
      margins: { top: 50, bottom: 0, left: 50, right: 50 },
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
      doc.font('Helvetica-Bold').fontSize(10).text(`Type of Inspection : ${jobData.inspection_type}`, { align: 'left' });
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

    while (imageIndex < allImages.length) {
      let currentY = marginTop;
      const centerX = (doc.page.width - imageWidth) / 2;
  
      const imgPath = path.join('public', 'storage', 'inspection-images', allImages[imageIndex].file_path);
      doc.image(imgPath, centerX, currentY, { width: imageWidth, height: imageHeight });
      doc.fontSize(10).text(allImages[imageIndex].title || '', centerX, currentY + imageHeight + titleGap, {
        align: 'center',
        width: imageWidth,
      });
      imageIndex++;
  
      currentY += imageHeight + titleGap + verticalGap;
  
      if (imageIndex < allImages.length) {
        const imgPath2 = path.join('public', 'storage', 'inspection-images', allImages[imageIndex].file_path);
        doc.image(imgPath2, centerX, currentY, { width: imageWidth, height: imageHeight });
        doc.fontSize(10).text(allImages[imageIndex].title || '', centerX, currentY + imageHeight + titleGap, {
          align: 'center',
          width: imageWidth,
        });
        imageIndex++;
      }
  
      addFooter(doc, pageNumber);
      pageNumber++;
  
      if (imageIndex < allImages.length) doc.addPage();
    }

    // Finalize the PDF
    doc.end();

    // 3. Save the PDF name to the database
    await this.prisma.jobs.update({
      where: { id: jobId },
      data: { pdf_data: pdfPath, working_status: 'completed' },
    });
    
    await this.mailService.sendInspectionPDF({
      email: process.env.MAIL_USERNAME,
      jobId,
      jobData,
    });
  
    return {
      status: 201,
      success: true,
      message: 'Inspection PDF generated and sent.',
      pdf_url: `/public/storage/inspection-pdf/${jobId}.pdf`,
    };
  }

  async getDraftJobs(userId) {
    try {
      const response = await this.prisma.jobs.findMany({
        where: { working_status: 'draft', inspector_id: userId },
        orderBy: { created_at: 'desc' },
        include: {
          images: true,  // Include the related images
        },
      });
      const formatted = response.map(job => ({
        ...job,
        pdf_data: job.pdf_data 
          ? `public/storage/inspection-pdf/${job.pdf_data}` // ✅ prefix only if pdf exists
          : null,
      }));
      return{
        status: 200,
        success: true,
        message: 'Fetch all Reports',
        data: formatted
      }
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  async getDraftJobsById(userId: string, jobId: string) {
    const job = await this.prisma.jobs.findFirst({
      where: {
        working_status: 'pending',
        id: jobId,
        inspector_id: userId,
      },
      include: {
        areas: { include: { images: true } },  // ✅ get areas with images
      },
    });
  
    if (!job) {
      return { status: 404, success: false, message: 'Draft report not found', data: null };
    }
  
    const formattedAreas = job.areas.map(area => ({
      area_id: area.id,
      area_name: area.name,
      note: area.note,
      images: area.images.map(img => ({
        ...img,
        image_id: img.id,
        file_path: `/public/storage/inspection-images/${img.file_path}`,
      })),
    }));
  
    return {
      status: 200,
      success: true,
      message: 'Fetch Report Successfully',
      data: {
        id: job.id,
        inspector_id: job.inspector_id,
        inspector_name: job.inspector_name,
        inspection_type: job.inspection_type,
        address: job.address,
        fha_number: job.fha_number,
        created_at: job.created_at,
        completed_at: job.completed_at,
        status: job.status,
        standard_fee: job.standard_fee,
        rush_fee: job.rush_fee,
        occupied_fee: job.occupied_fee,
        long_range_fee: job.long_range_fee,
        notes: job.notes,
        working_status: job.working_status,
        due_date: job.due_date,
        pdf_data: job.pdf_data
          ? `public/storage/inspection-pdf/${job.pdf_data}`
          : null,
        areas: formattedAreas,
      },
    };
  }
  
  
  
  
  
  async deleteImage(imageId: string) {
    try {
      // Find the image by ID first to check if it exists
      const image = await this.prisma.jobImage.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      const filePath = path.resolve(process.cwd(), 'public', image.file_path.replace(/^public[\\/]/, ''));

      // Debugging: Log the file path to ensure it's correct
  
      // Check if the file exists before attempting to delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file from the filesystem
      } else {
        console.log('File not found at the given path');
      }

      // Now delete the image from the database
      await this.prisma.jobImage.delete({
        where: { id: imageId },
      });

      return {
        status: 200,
        success: true,
        message: 'Image Removed',
      };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createJobArea(jobId: string, name: string, note?: string) {
    try {
      console.log(jobId, name, note);
      const area = await this.prisma.jobArea.create({
        data: { job_id: jobId, name, note: note ?? null },
      });
      return { status: 201, success: true, message: 'Area created successfully', data: area };
    } catch {
      throw new HttpException('Could not create area', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

  async bulkUploadJobImages(
    payload: {
      jobId: string;
      statusType: 'draft';
      areas: {
        areaId?: string;
        name?: string;
        note?: string;
        images: { title: string; description?: string; fileIndex: number }[];
      }[];
    },
    files: Express.Multer.File[],
    userId: string,
  ) {
    const { jobId, areas } = payload;
    const groupedAreas: Record<string, any[]> = {};


    for (const areaPayload of areas) {
      let area;
      if (areaPayload.areaId) {
        area = await this.prisma.jobArea.findUnique({ where: { id: areaPayload.areaId } });
      } else if (areaPayload.name) {
        area = await this.prisma.jobArea.create({
          data: { job_id: jobId, name: areaPayload.name, note: areaPayload.note ?? null },
        });
      }
      if (!area) throw new HttpException('Area not found', HttpStatus.NOT_FOUND);

      if (areaPayload.note && areaPayload.note !== area.note) {
        await this.prisma.jobArea.update({ where: { id: area.id }, data: { note: areaPayload.note } });
      }

      for (const img of areaPayload.images) {
        const file = files[img.fileIndex];
        if (!file) {
          throw new HttpException(`Missing file at index ${img.fileIndex}`, HttpStatus.BAD_REQUEST);
        }
        const existing = await this.prisma.jobImage.findFirst({
          where: {
            job_id: jobId,
            area_id: area.id,
            file_path: file.filename,
          },
        });
        
        if (!existing) {
          const createdImage = await this.prisma.jobImage.create({
            data: {
              job_id: jobId,
              area_id: area.id,
              file_path: file.filename,
              title: img.title ?? '',
              description: img.description ?? null,
            },
          });
        
          if (!groupedAreas[area.id]) groupedAreas[area.id] = [];
          groupedAreas[area.id].push(createdImage);
        } else {
          // Optional: you can push existing image to response instead of skipping
          if (!groupedAreas[area.id]) groupedAreas[area.id] = [];
          groupedAreas[area.id].push(existing);
        }
      }
    }
    const data = Object.keys(groupedAreas).map(areaId => ({
      area_id: areaId,
      images: groupedAreas[areaId],
    }));
    return { status: 201, success: true, message: 'Images uploaded to all areas.', 
      data: Object.keys(groupedAreas).map(areaId => ({
      area_id: areaId,
      images: groupedAreas[areaId].map(img => ({
        ...img,
        file_path: `/public/storage/inspection-images/${img.file_path}` // ✅ add prefix only in response
      }))
    })) };
  }

  // async uploadAreaImages(
  //   areaId: string,
  //   imageData: Array<{ title: string; description?: string }>,
  //   images: Express.Multer.File[],
  //   statusType: 'draft' | 'completed' = 'draft',
  // ) {
  //   if (images.length !== imageData.length) {
  //     throw new HttpException('Number of images does not match imageData length', HttpStatus.BAD_REQUEST);
  //   }

  //   const area = await this.prisma.jobArea.findUnique({ where: { id: areaId }, include: { job: true } });
  //   if (!area) throw new HttpException('Area not found', HttpStatus.NOT_FOUND);

  //   for (let i = 0; i < images.length; i++) {
  //     await this.prisma.jobImage.create({
  //       data: {
  //         job_id: area.job_id,
  //         area_id: areaId,
  //         file_path: images[i].path,
  //         title: imageData[i].title,
  //         description: imageData[i].description ?? null,
  //       },
  //     });
  //   }

  //   return { status: 201, success: true, message: 'Images uploaded to area.' };
  // }

  // async listJobAreas(jobId: string) {
  //   const areas = await this.prisma.jobArea.findMany({
  //     where: { job_id: jobId },
  //     include: { images: true },
  //     orderBy: { created_at: 'asc' },
  //   });
  //   return { status: 200, success: true, data: areas };
  // }
}
