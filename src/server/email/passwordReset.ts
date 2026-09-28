import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const smtpUser =
    process.env.SMTP_USER;

  const smtpPassword =
    process.env.SMTP_PASS;

  if (
    !smtpUser ||
    !smtpPassword
  ) {
    throw new Error(
      "Email service is not configured."
    );
  }

  const transporter =
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || smtpUser,

    to: email,

    subject:
      "Reset your Green Holiday password",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 520px;
        margin: auto;
      ">
        <h2 style="color:#08764f;">
          Green Holiday
        </h2>

        <p>
          A password change was requested
          for your administrator account.
        </p>

        <p>
          Click the button below to create
          your new password.
        </p>

        <p style="margin:30px 0;">
          <a
            href="${resetLink}"
            style="
              background:#0B7656;
              color:#ffffff;
              padding:12px 22px;
              border-radius:6px;
              text-decoration:none;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This link is valid for 30 minutes.
        </p>

        <p>
          If you did not request this change,
          you can ignore this email.
        </p>
      </div>
    `,
  });
}