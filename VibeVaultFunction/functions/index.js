const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.sendInviteEmail = functions.https.onRequest(
  async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");

    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "GET, POST");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.set("Access-Control-Max-Age", "3600");
      response.status(204).send("");
      return;
    }

    if (!request.body.email || !request.body.companyId) {
      console.error("Email or Company ID not provided");
      response
        .status(400)
        .send("Bad Request: Email or Company ID not provided.");
      return;
    }

    const email = request.body.email;
    const companyId = request.body.companyId;
    const token = uuidv4();

    try {
      await admin.firestore().collection("invitations").add({
        email: email,
        token: token,
        companyId: companyId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      const registrationLink = `http://localhost:3000/employee-signup?token=${token}`;
      const mailOptions = {
        from: `Your App Name <${gmailEmail}>`,
        to: email,
        subject: "Invitation to Join Our Team",
        text: `You have been invited to join our platform. Please click on the link to register: ${registrationLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #444; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h1 style="color: #5D5FEF;">Welcome to Our Platform!</h1>
            <p style="font-size: 16px;">You have been invited to join our team.</p>
            <a href="${registrationLink}" style="background-color: #5D5FEF; color: white; padding: 12px 24px; margin: 20px auto; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-size: 18px; font-weight: bold;">Register Here</a>
            <p style="font-size: 14px;">If you have any questions, feel free to <a href="mailto:${gmailEmail}" style="color: #5D5FEF; text-decoration: none;">contact us</a>.</p>
          </div>
        `,
      };

      await mailTransport.sendMail(mailOptions);
      console.log("Email sent");
      response.status(200).send("Success");
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Error: " + error.message);
    }
  }
);
