# Supabase Setup for ASHA Mitra App

This guide will help you set up Supabase for your ASHA Mitra app.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in or create an account
2. Create a new project
3. Choose a name for your project and set a secure database password
4. Choose a region close to your users
5. Wait for your project to be created (this may take a few minutes)

## 2. Set Up the Database

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/profiles_table.sql` from this repository
3. Paste it into the SQL Editor and click "Run"
4. This will create the profiles table with the necessary columns and security policies

## 3. Configure Authentication

1. In your Supabase project dashboard, go to Authentication > Settings
2. Under "Email Auth", make sure "Enable Email Signup" is turned on
3. You can configure email templates under "Email Templates"
4. If you want to allow users to reset their passwords, make sure "Enable email confirmations" is turned on

## 4. Get Your API Keys

1. In your Supabase project dashboard, go to Settings > API
2. Copy your "Project URL" and "anon" public key
3. Update the `.env` file in your project with these values:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Install Dependencies

Make sure you have all the required dependencies installed:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed @rneui/base react-native-url-polyfill
```

## 6. Run Your App

Now you can run your app with Supabase authentication:

```bash
npm start
```

## Additional Configuration

### Email Verification

By default, Supabase requires email verification. If you want to change this:

1. Go to Authentication > Settings
2. Under "Email Auth", you can toggle "Enable email confirmations"

### Password Policies

You can configure password policies:

1. Go to Authentication > Settings
2. Under "Password Auth", you can set minimum password length and other requirements

### Social Login

If you want to add social login (Google, Facebook, etc.):

1. Go to Authentication > Providers
2. Enable and configure the providers you want to use
3. Update your app code to support these providers

## Troubleshooting

- If you encounter CORS issues, go to Settings > API and add your app's URL to the "Additional Allowed CORS Origins"
- If authentication isn't working, check the browser console for errors
- Make sure your environment variables are correctly set
- Check that your Supabase project is on the free plan or has enough credits
