# Google OAuth Setup Guide

## Backend Setup

### 1. Install Passport Google OAuth
```bash
cd backend
npm install passport-google-oauth20 @types/passport-google-oauth20
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs:
   - Development: `http://localhost:4201/shanda/auth/google/callback`
   - Production: `https://yourapp.com/api/auth/google/callback`

### 3. Add to Backend .env
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4201/shanda/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

### 4. Create Google Strategy

Create `backend/src/modules/auth/strategies/google.strategy.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
```

### 5. Update Auth Service

Add to `backend/src/modules/auth/auth.service.ts`:
```typescript
async googleLogin(googleUser: any) {
  let user = await this.prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  if (!user) {
    // Create new user from Google profile
    user = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        emailVerified: true, // Google emails are verified
        roles: [UserRole.OWNER],
        // No password needed for OAuth users
      },
    });
  }

  const token = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    roles: user.roles,
  });

  return {
    token,
    user: new UserEntity(user),
  };
}
```

### 6. Add Routes to Controller

Add to `backend/src/modules/auth/auth.controller.ts`:
```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth() {
  // Redirects to Google
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Request() req, @Response() res) {
  const { token, user } = await this.authService.googleLogin(req.user);
  
  // Redirect to frontend with token
  const frontendUrl = this.configService.get('FRONTEND_URL');
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
}
```

### 7. Register Strategy in Module

Update `backend/src/modules/auth/auth.module.ts`:
```typescript
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // ... existing imports
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy, // Add this
  ],
  // ... rest
})
```

## Frontend Setup

### 1. Add Google Sign-In Button

Update `frontend/src/routes/auth/login.tsx` and `signup.tsx`:
```tsx
import { env } from '@/config/env';

// Add after regular login form
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white text-gray-500">Or continue with</span>
  </div>
</div>

<a
  href={`${env.API_URL}/auth/google`}
  className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  <span className="font-medium text-gray-700">Continue with Google</span>
</a>
```

### 2. Create OAuth Callback Handler

Create `frontend/src/routes/auth/callback.tsx`:
```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ROUTES } from '@/config/routes';

export const Route = createFileRoute('/auth/callback')({
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const { token } = useSearch({ from: '/auth/callback' }) as { token?: string };
  const { setToken } = useAuth();

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate({ to: ROUTES.OWNER_DASHBOARD });
    } else {
      navigate({ to: ROUTES.LOGIN });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
```

## Testing

1. Start backend: `npm run start:dev`
2. Start frontend: `npm run dev`
3. Go to login/signup page
4. Click "Continue with Google"
5. Authorize the app
6. Should redirect back logged in!

## Production Checklist
- [ ] Set production callback URL in Google Console
- [ ] Update GOOGLE_CALLBACK_URL in production .env
- [ ] Update FRONTEND_URL in production .env
- [ ] Test OAuth flow on staging
- [ ] Monitor for failed OAuth attempts
