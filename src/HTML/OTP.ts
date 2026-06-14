// OTP.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData } from "./Data";

interface OTPData {
    otp: string | number;
    username?: string;
    expiresInMinutes?: number;
    verifyLink?: string;
}

const OTPTemplate = (data: OTPData): string => {
    const { otp, app } = TemplateData;
    const expiresIn = data.expiresInMinutes ?? 10;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${otp.subject} – ${app.name}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${otp.title}</h2>
                <p>${otp.subtitle}</p>
                <span class="badge">${otp.badge}</span>
            </div>
        </div>

        <div class="content">
            <h1>${otp.heading(data.username)}</h1>
            <p>${otp.body(app.name)}</p>

            <div class="otp-wrapper">
                <div class="otp">${data.otp}</div>
                <p class="otp-note">${otp.expiresText(expiresIn)}</p>
            </div>

            <hr class="divider-line" />

            <p style="font-size:13px; color:#475569; text-align:center;">
                ${otp.ignoreText}
            </p>

            ${data.verifyLink ? `
            <div class="btn-wrap">
                <a href="${data.verifyLink}" class="button">${otp.buttonText}</a>
            </div>` : ''}
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default OTPTemplate;