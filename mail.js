// Import necessary modules
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import fs from 'fs';
// // // Load environment variables from a .env file
dotenv.config();
// const filePath = "C:/Users/dalvi/Downloads/_51_CP Report_TextClassificationUsingOCRandNER.pdf";
// const textFilePath = "C:/Users/dalvi/Downloads/output.txt";
// try {
//   const pdfFile = fs.readFileSync(filePath);
//   console.log('PDF file read successfully:', pdfFile);
//   const pdfContentString = pdfFile.toString();
//   fs.writeFileSync(textFilePath, pdfContentString);
//   console.log('PDF content successfully written to text file:', textFilePath);
//   // Process the content of the PDF file as needed
// } catch (error) {
//   console.error('Error reading PDF file:', error.message);
// }
const links = [
    'QmQysmDDCUZi6tZUgUJsZPmLWWqCZW1iomJF36Pr9rsdCy',
    'QmTzeuMjnKueSpJb6q3XqbHJP1zvDcaefG9X9Y8Z4EzK4H',
    'QmcozjsKDkEsBLAsVSQugjmzvJyAEFXshzW33sEDec6Byf',
    'QmYyKeaDmypkLrQVfx1V52fDy8ptCjciRCTCCJfWiQxMY7'
  ];

// Create a nodemailer transporter
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASS,
    },
});

// Define the sendMail function
async function sendMail(params) {
    var mailOptions = {
        to: params.to,
        subject: 'New Notarization Request Received at SecureSign!',
        html: `<h3>You are requested to notarize the following document:</h3>
        <h2>Please click on this <a href="http://localhost:3000/index.html">Link</a> to complete the notarization process.</h2>
        <p>Thank you for choosing our notary services. We look forward to assisting you with the notarization of your document.</p>
        <h4>SecureSign</h4>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

// Example usage of sendMail function
var emailParams = {
    to: 'dalvimanas33@gmail.com', // Replace with the actual recipient's email address
};

sendMail(emailParams);

// emailParams = {
//     to: 'manas.dalvi21@vit.edu', // Replace with the actual recipient's email address
// };

// sendMail(emailParams);
// http://localhost:8080/ipfs/QmYyKeaDmypkLrQVfx1V52fDy8ptCjciRCTCCJfWiQxMY7