const jwt = require('jsonwebtoken');

const emailTemplate = (email) => {
  const token = jwt.sign(
    { email }, 
    process.env.JWT_KEY, 
    { expiresIn: process.env.TOKEN_LIFETIME} 
  );
  const url = `http://localhost:${process.env.PORT}/users/verify/${token}`;

  return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Email</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                line-height: 1.6;
                color: #333;
            }
            
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                padding: 40px 20px;
            }
            
            .header h1 {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .content h2 {
                color: #333;
                font-size: 24px;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .content p {
                color: #666;
                font-size: 16px;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .confirm-section {
                text-align: center;
                margin: 40px 0;
            }
            
            .confirm-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 50px;
                font-size: 18px;
                font-weight: 600;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            .confirm-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                text-decoration: none;
                color: white;
            }
            
            .alternative-link {
                margin-top: 30px;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 6px;
            }
            
            .alternative-link p {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            
            .alternative-link a {
                color: #667eea;
                word-break: break-all;
                text-decoration: none;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            
            .footer p {
                color: #666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .footer .company-info {
                color: #999;
                font-size: 12px;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 0;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .header {
                    padding: 30px 20px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .confirm-button {
                    padding: 14px 30px;
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Welcome!</h1>
                <p>Thanks for joining our community</p>
            </div>
            
            <div class="content">
                <h2>Confirm Your Email Address</h2>
                <p>Hi there!</p>
                <p>Thank you for signing up! To complete your registration and start enjoying all our features, please confirm your email address by clicking the button below.</p>
                
                <!-- Confirmation Button -->
                <div class="confirm-section">
                    <a href="${url}" class="confirm-button">Confirm My Email</a>
                </div>
                
                <p>This confirmation link will expire in 24 hours for security reasons.</p>
                

            </div>
            
            <div class="footer">
                <p>If you didn't create an account with us, you can safely ignore this email.</p>
                <p>Need help? Contact our support team at <a href="mailto:markgeforce4080@gmail.com" style="color: #667eea;">markgeforce4080@gmail.com</a></p>
                <div class="company-info">
                    <p>© 2025 QuickCart. All rights reserved.</p>
                    <p>Alexandria, Al Agamy, Al Hanouvel</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
};

module.exports = emailTemplate;