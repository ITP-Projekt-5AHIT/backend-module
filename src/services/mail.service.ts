import Mail from 'nodemailer/lib/mailer';
import transport from '../utils/mailer';
import config from '../config/config';

export const sendMail = async (mailOptions: Mail.Options) => {
  return await transport.sendMail(mailOptions);
};

export const sendPwdResetMail = async (token: string, toMail: string) => {
  return await transport.sendMail({
    to: toMail,
    from: config.EMAIL_FROM_ADDRESS,
    subject: 'Passwort vergessen',
    html: `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                text-align: center;
            }
            .header {
                background-color: #007bff;
                color: #fff;
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin: 15px 0;
                line-height: 1.6;
            }
            .token {
                display: inline-block;
                background-color: #f8f9fa;
                color: #007bff;
                font-size: 20px;
                font-weight: bold;
                padding: 10px 15px;
                border: 1px solid #007bff;
                border-radius: 4px;
                margin: 20px 0;
            }
            .footer {
                font-size: 12px;
                color: #666;
                margin: 20px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Passwort zurücksetzen</h1>
            </div>
            <div class="content">
                <p>Hallo,</p>
                <p>Ihr Einmal-Token zum Zurücksetzen Ihres Passworts lautet:</p>
                <div class="token">${token}</div>
                <p>Bitte geben Sie diesen Code in Ihrer App ein, um Ihr Passwort zurückzusetzen.</p>
                <p>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Ires. Alle Rechte vorbehalten. ITP @ HTBLA-WELS</p>
            </div>
        </div>
    </body>
    </html>
    `,
  });
};
