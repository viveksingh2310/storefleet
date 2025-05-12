// Import the necessary modules here
import nodemailer from 'nodemailer'


export const sendWelcomeEmail = async (user) => {
  if(!user){
    return null;
  }
  const { name, email}=user;
  // Write your code here
  const transporter = nodemailer.createTransport({
    service:process.env.SMPT_SERVICE,
    auth: {
    user: process.env.STORFLEET_SMPT_MAIL,
    pass: process.env.STORFLEET_SMPT_MAIL_PASSWORD
    }
    });
    const mailOptions = {
    from: process.env.STORFLEET_SMPT_MAIL,
    to: email,
    subject:`Hello ${name}, welcome to Storefleet` ,//this is the html content that will be sent to the user
    html: `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Add your custom CSS styles here */
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                }
                .logo {
                    max-width: 150px;
                }
                .content {
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #20d49a;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                /* Mobile Responsive Styles */
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    .logo {
                        max-width: 100px;
                    }
                    .button {
                        display: block;
                        margin-top: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://files.codingninjas.in/logo1-32230.png" alt="Storefleet Logo">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Welcome to storefleet!!, ${user.name}</p>
                    <p>
                    <b>Welcome to Storefleet! 🛒
We’re absolutely thrilled to have you on board.</b></p>
<p>Your shopping journey just got a whole lot better — from smart deals to smooth tracking and personalized picks, Storefleet is here to make your experience faster, easier, and more fun.</p>

<p>
<b>✨ Here’s what you can do with Storefleet:</b>
<ul>
<li>Browse and shop the latest products with ease</li>
<li>Track your orders in real time</li>
<li>Save your favorites and create custom wishlists</li>
<li>Get exclusive member-only deals and alerts</li>
</ul> 
</p>
  </div>
            </div>
        </body>
        </html>
        `,
    };
    
    // Send the email
   await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
    });
};