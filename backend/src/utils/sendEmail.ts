import nodemailer from 'nodemailer';

const sendEmail = async (email: string, redirectUrl: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSKEY,
      },
    });

    await transporter.sendMail({
      from: `"SpotME" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Verify your SpotME Sign-In',
      // text: 'Welcome to SpotME',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
          <h2 style="color: #111111; margin-bottom: 16px;">Verify your sign-in</h2>
          <p style="color: #555555; font-size: 16px; line-height: 1.5;">
            You requested a link to sign in to your <strong>SpotME</strong> account. Click the button below to complete the verification:
          </p>
          <div style="margin: 24px 0;">
            <a href="${redirectUrl}" style="background-color: #E8572A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Verify and Sign In
            </a>
          </div>
          <p style="color: #888888; font-size: 12px; line-height: 1.4; margin-top: 32px; ">
            If you did not request this email, you can safely ignore it. This link will expire shortly.
          </p>
        </div>
      `,
    });
    console.log('Email sent successfully to:', email);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`[Email Error] ${err.name}: ${err.message}`);
      console.error(err.stack);
    }
    throw new Error('Failed to send verification email. Please try again later.');
  }
};

export { sendEmail };
