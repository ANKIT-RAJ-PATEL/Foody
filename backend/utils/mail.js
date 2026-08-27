import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});


export const sendOtpMail = async (to,otp) => {
     await transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Your OTP for Password Reset",
        html: `Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.`,

     })
}

export const sendDeliveryOtpMail = async (user,otp) => {
     await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Delivery OTP",
        html: `Your delivery OTP is <b>${otp}</b>. It is valid for 5 minutes.`,

     })
}

