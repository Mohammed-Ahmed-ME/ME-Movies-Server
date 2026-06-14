// Welcome.ts
import {LightStyle, style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData } from "./Data";

interface WelcomeData {
    username: string;
    portalLink?: string;
}

const WelcomeTemplate = (data: WelcomeData): string => {
    const { welcome, app } = TemplateData;
    const finalPortalLink = data.portalLink ?? app.url;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${welcome.subject(data.username)}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>Welcome to ${app.name} 🎬</h2>
                <p>${welcome.title}</p>
                <span class="badge">${welcome.badge}</span>
            </div>
        </div>

        <div class="content">
            <h1>${welcome.heading(data.username)}</h1>
            <p>${welcome.body}</p>

            <div class="info">
                ${welcome.features.map(feature => `<p>${feature}</p>`).join('')}
            </div>

            <div class="alert-box">
                💡 ${welcome.tip}
            </div>

            <div class="btn-wrap">
                <a href="${finalPortalLink}" class="button">${welcome.buttonText}</a>
            </div>
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default WelcomeTemplate;