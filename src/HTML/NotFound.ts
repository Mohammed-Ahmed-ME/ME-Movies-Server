// NotFound.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData, formatTime } from "./Data";

interface NotFoundData {
    path: string;
    method: string;
    status?: number;
    timestamp?: string;
    suggestedLinks?: { label: string; href: string }[];
}

const NotFoundTemplate = (data: NotFoundData): string => {
    const { notFound, app } = TemplateData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${notFound.subject(app.name)}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header error">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${notFound.title}</h2>
                <p>${notFound.subtitle}</p>
                <span class="badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.35);color:#fca5a5;">
                    ${notFound.badge}
                </span>
            </div>
        </div>

        <div class="content">
            <h1>${notFound.heading}</h1>
            <p>${notFound.body(app.name, data.path)}</p>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-label">${notFound.pathLabel}</div>
                    <div class="stat-value"><code>${data.path}</code></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${notFound.methodLabel}</div>
                    <div class="stat-value"><code>${(data.method || 'GET').toUpperCase()}</code></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${notFound.statusLabel}</div>
                    <div class="stat-value status-error">${data.status ?? 404}</div>
                </div>
                ${data.timestamp ? `
                <div class="stat-card">
                    <div class="stat-label">${notFound.timestampLabel}</div>
                    <div class="stat-value" style="font-size:12px;">${formatTime(data.timestamp)}</div>
                </div>` : ''}
            </div>

            ${data.suggestedLinks?.length ? `
            <h3>${notFound.suggestionsHeader}</h3>
            <ul>
                ${data.suggestedLinks.map(link => `
                <li class="endpoint-card">
                    <a href="${link.href}" style="color:#a78bfa;">${link.label}</a>
                </li>`).join('')}
            </ul>` : ''}

            <div class="btn-wrap">
                <a href="${app.url}" class="button error">${notFound.buttonText}</a>
            </div>
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default NotFoundTemplate;