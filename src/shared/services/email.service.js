import nodemailer from "nodemailer";
export const sendEmail = async (to, subject, html) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ducmanh200555@gmail.com",
      pass: process.env.App_pass_email,
    },
  });
  await transport.sendMail({
    from: "Duc Manh",
    to,
    subject,
    html,
  });
};
