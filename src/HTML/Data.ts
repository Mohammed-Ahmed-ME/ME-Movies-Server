// Data.ts
import {imageToBase64} from "../utils/imageToBase64.ts";

export const TemplateData = {
    app: {
        name:   process.env.APP_NAME || 'Movie App',
        logo:   imageToBase64(`${process.env.APP_LOGO}`),
        url:    process.env.APP_URL || '/',
        phone:  process.env.APP_PHONE || '',
        email:  process.env.APP_MAIL || '',
        meName: process.env.ME_NAME || '',
        meLogo: imageToBase64(`${process.env.ME_LOGO_DARK}`),
    },
    welcome: {
        subject: (username: string) => `Welcome to ${process.env.APP_NAME || 'Movie App'}, ${username}!`,
        title: "Your cinematic journey starts here",
        badge: "✨ New Member",
        heading: (username: string) => `Hello, ${username} 👋`,
        body: "We're thrilled to have you join — your personal movie discovery platform. Explore thousands of titles, save your favourites, and never miss a must-watch again.",
        features: [
            "🎥 Discover trending and latest movies",
            "🔖 Save movies to your personal watchlist",
            "🔍 Search by title, genre, or keyword",
            "⭐ Ratings & reviews at a glance"
        ],
        tip: "Pro tip — use the Search tab to find movies by genre or mood in seconds.",
        buttonText: "🍿 Start Watching",
    },
    otp: {
        subject: "Verify Your Account",
        title: "Verify Your Account",
        subtitle: "One step away from the movies",
        badge: "🔐 Email Verification",
        heading: (username?: string) => username ? `Hey ${username},` : 'Almost there!',
        body: (appName: string) => `Enter the code below to verify your <strong style="color:#a78bfa">${appName}</strong> account and unlock your full movie experience.`,
        codeLabel: "Your verification code:",
        expiresText: (minutes: number) => `⏳ This code expires in <strong style="color:#a78bfa">${minutes} minutes</strong>`,
        ignoreText: "Didn't request this? You can safely ignore this email — your account won't be verified until you enter the code.",
        buttonText: "✅ Verify Account",
    },
    forgotPassword: {
        subject: "Reset Your Password",
        title: "Password Reset Request",
        subtitle: "We received a reset request for your account",
        badge: "🔑 Password Reset",
        heading: (username?: string) => username ? `Hi ${username},` : 'Reset your password',
        body: (appName: string, expiresMinutes: number) => `Someone requested a password reset for your <strong style="color:#a78bfa">${appName}</strong> account. Use the code below to continue. It's valid for <strong style="color:#f87171">${expiresMinutes} minutes</strong>.`,
        expiresText: (minutes: number) => `⏳ Expires in ${minutes} minutes`,
        warningText: "🚨 If you didn't request this, your account may be at risk. Please secure it by changing your password immediately.",
        buttonText: "🔑 Reset Password",
    },
    login: {
        subject: "New Login Detected",
        title: "New Login Detected",
        subtitle: "A new sign-in was recorded on your account",
        badge: "🔔 Security Alert",
        heading: (username: string) => `Hi ${username},`,
        body: (appName: string) => `We noticed a new login to your <strong style="color:#a78bfa">${appName}</strong> account. Here are the details:`,
        deviceLabel: "📱 Device",
        browserLabel: "🌐 Browser",
        osLabel: "🖥 OS",
        ipLabel: "📍 IP Address",
        timeLabel: "🕐 Login Time",
        locationLabel: "🌍 Location",
        wasYouText: "✅ Was this you? No action needed — enjoy the movies!",
        wasNotYouText: "❌ Wasn't you? Change your password immediately below.",
        buttonText: "🔒 Secure My Account",
    },
    health: {
        subject: (appName: string) => `${appName} – Health Dashboard`,
        title: "Health Monitor",
        subtitle: "System status & diagnostics",
        badge: "🟢 Operational",
        statusLabel: "⚡ Status",
        environmentLabel: "🌍 Environment",
        versionLabel: "📦 Version",
        uptimeLabel: "⏱ Uptime",
        memoryLabel: "🧠 Memory",
        timestampLabel: "🕐 Timestamp",
        databaseHeader: "Database",
        connectionLabel: "🔌 Connection",
        kindLabel: "🛢 Kind",
        dbNameLabel: "📋 Database",
        hostLabel: "🌐 Host",
        operationalText: "Operational",
        connectedText: "✅ Connected",
        disconnectedText: "❌ Disconnected",
    },
    api: {
        subject: (appName: string) => `${appName} – API Dashboard`,
        title: "API",
        subtitle: "Available endpoints & system overview",
        badgePrefix: "🚀 v",
        messageLabel: "💬 Message",
        environmentLabel: "🌍 Environment",
        versionLabel: "📦 Version",
        routesLabel: "📋 Routes",
        endpointsHeader: "Endpoints",
        endpointsSuffix: "endpoints",
        docsButtonText: "📖 View Full Docs",
    },
    notFound: {
        subject: (appName: string) => `404 – Route Not Found | ${appName}`,
        title: "🚫 Route Not Found",
        subtitle: "The endpoint you're looking for doesn't exist",
        badge: "404 Error",
        heading: "Oops, wrong set!",
        body: (appName: string, path: string) => `The route <code>${path}</code> doesn't exist on the <strong style="color:#a78bfa">${appName}</strong> API. Check the request path and try again.`,
        pathLabel: "📍 Path",
        methodLabel: "🔧 Method",
        statusLabel: "❌ Status",
        timestampLabel: "🕐 Timestamp",
        suggestionsHeader: "Try these instead",
        buttonText: "← Back to API Home",
    },
};

export const formatTime = (t?: Date | string): string => {
    if (!t) return 'Unknown';
    return t instanceof Date ? t.toLocaleString() : t;
};

export const methodColor: Record<string, string> = {
    GET: '#34d399',
    POST: '#60a5fa',
    PUT: '#fbbf24',
    PATCH: '#a78bfa',
    DELETE: '#f87171',
};

export const getSafeMethod = (method: string = 'GET'): string => {
    return (method || 'GET').toUpperCase();
};

export const formatUptime = (uptimeSeconds: number): string => {
    const uptimeHours = uptimeSeconds / 3600;
    const uptimeMins = uptimeSeconds / 60;
    return uptimeHours >= 1 ? `${uptimeHours.toFixed(2)} hrs` : `${uptimeMins.toFixed(1)} min`;
};