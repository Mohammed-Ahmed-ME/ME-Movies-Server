// ForgotPassword.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData, formatTime } from "./Data";

interface ForgotPasswordData {
    otp: string | number;
    username?: string;
    expiresInMinutes?: number;
    resetLink?: string;
    requestedAt?: Date | string;
}

const ForgotPasswordTemplate = (data: ForgotPasswordData): string => {
    const { forgotPassword, app } = TemplateData;
    const expiresIn = data.expiresInMinutes ?? 10;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${forgotPassword.subject} – ${app.name}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header error">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${forgotPassword.title}</h2>
                <p>${forgotPassword.subtitle}</p>
                <span class="badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.35);color:#fca5a5;">
                    ${forgotPassword.badge}
                </span>
            </div>
        </div>

        <div class="content">
            <h1>${forgotPassword.heading(data.username)}</h1>
            <p>${forgotPassword.body(app.name, expiresIn)}</p>

            <div class="otp-wrapper">
                <div class="otp" style="border-color:rgba(239,68,68,0.4); background:rgba(239,68,68,0.08);">
                    ${data.otp}
                </div>
                <p class="otp-note">${forgotPassword.expiresText(expiresIn)}</p>
            </div>

            ${data.requestedAt ? `
            <div class="info">
                <p><strong>Requested at:</strong> <code>${formatTime(data.requestedAt)}</code></p>
            </div>` : ''}

            <div class="alert-box" style="background:rgba(239,68,68,0.07);border-color:rgba(239,68,68,0.2);color:#fca5a5;">
                ${forgotPassword.warningText}
            </div>

            ${data.resetLink ? `
            <div class="btn-wrap">
                <a href="${data.resetLink}" class="button error">${forgotPassword.buttonText}</a>
            </div>` : ''}
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default ForgotPasswordTemplate;