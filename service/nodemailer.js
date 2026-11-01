const nodemailer = require("nodemailer")

async function sendEmailVerification(email, username, verificationUrl) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    })

   
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        
                        <!-- Header / Logo -->
                        <tr>
                            <td align="center" style="padding-bottom: 24px;">
                                <h1 style="color: #0f172a; font-size: 24px; margin: 0;">Connectly</h1>
                                <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Mini Facebook</p>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td>
                                <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">Hi ${username},</h2>
                                <p style="color: #475569; font-size: 15px; line-height: 24px; margin-bottom: 24px;">
                                    Thanks for signing up! We're excited to have you on board. Please click the button below to verify your email address and activate your account, This is valid for 24hr.
                                </p>
                            </td>
                        </tr>

                        <!-- Call to Action Button -->
                        <tr>
                            <td align="center" style="padding: 10px 0 30px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" style="border-radius: 8px; background-color: #059669;">
                                            <a href="${verificationUrl}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; border: 1px solid #059669; display: inline-block;">
                                                Verify Email Address
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Fallback Link Text -->
                        <tr>
                            <td>
                                <p style="color: #64748b; font-size: 13px; line-height: 20px; margin-bottom: 20px;">
                                    If the button above doesn't work, copy and paste this link into your web browser:
                                </p>
                                <p style="word-break: break-all; color: #059669; font-size: 12px; margin-bottom: 30px;">
                                    <a href="${verificationUrl}" target="_blank" style="color: #059669;">${verificationUrl}</a>
                                </p>
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                                    If you didn't create an account with us, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Connectly Support" <${process.env.GMAIL_USER}>`, 
            to: email, 
            subject: "Verify Your Email", 
            text: `Hi ${username}, please verify your email by opening this link: ${verificationUrl}`, // Fallback plain text version
            html: htmlContent, // ✨ Styled HTML version
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

async function welcomeMessage(email, username) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    })

    // 🎨 Modern HTML Welcome Template (Without Login Button)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Connectly</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                        
                        <!-- Header / Logo -->
                        <tr>
                            <td align="center" style="padding-bottom: 24px;">
                                <h1 style="color: #0f172a; font-size: 26px; margin: 0;">Connectly 🎉</h1>
                                <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Your Mini Facebook Community</p>
                            </td>
                        </tr>

                        <!-- Greeting & Body -->
                        <tr>
                            <td>
                                <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">Welcome aboard, ${username}!</h2>
                                <p style="color: #475569; font-size: 15px; line-height: 24px; margin-bottom: 16px;">
                                    Your email has been successfully verified, and your account is now fully active. We're thrilled to have you join our growing community!
                                </p>
                                <p style="color: #475569; font-size: 15px; line-height: 24px; margin-bottom: 16px;">
                                    You're all set to connect with friends, share your favorite moments, customize your profile, and explore everything Connectly has to offer.
                                </p>
                                <p style="color: #475569; font-size: 15px; line-height: 24px; margin-bottom: 8px;">
                                    Thank you for becoming a part of our journey. Enjoy connecting!
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td>
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;">
                                <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
                                    If you ever need help, feel free to reach out to our support team.
                                </p>
                                <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 12px 0 0 0;">
                                    &copy; ${new Date().getFullYear()} Connectly. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Connectly Team" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Welcome to Connectly! 🚀",
            text: `Hi ${username}, welcome to Connectly! Your email is verified and your account is active. Thank you for joining our community!`,
            html: htmlContent,
        });
        console.log("Welcome email sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending welcome mail:", err);
    }
}



module.exports = {
    sendEmailVerification,
    welcomeMessage
}