export const emailVerificationTemplate = (verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0F172A; text-align: center;">Verify Your Email</h1>
        <p>Hello,</p>
        <p>Thanks for signing up for Service Connect! Please verify your email address to activate your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #F5B700; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Service Connect Team</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #666; text-align: center;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${verificationUrl}" style="color: #666;">${verificationUrl}</a>
        </p>
    </div>
</body>
</html>
`;
