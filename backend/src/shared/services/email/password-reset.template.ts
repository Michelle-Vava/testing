
export const passwordResetTemplate = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0F172A; text-align: center;">Reset Your Password</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password for your Service Connect account.</p>
        <p>Click the button below to reset it. This link is valid for 1 hour.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #F5B700; color: #0F172A; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br>The Service Connect Team</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #666; text-align: center;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${resetUrl}" style="color: #666;">${resetUrl}</a>
        </p>
    </div>
</body>
</html>
`;
