// API.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData, methodColor, getSafeMethod } from "./Data";

export interface RouteItem {
    icon: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
    path: string;
    description?: string;
}

interface APIData {
    message: string;
    version: string;
    environment: string;
    routes: RouteItem[];
    docsLink?: string;
}

const APITemplate = (data: APIData): string => {
    const { api, app } = TemplateData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${api.subject(app.name)}</title>
    <style>
        ${style}
        .method-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.5px;
            font-family: monospace;
            min-width: 52px;
            text-align: center;
            margin-right: 8px;
        }
        .endpoint-row {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }
        .endpoint-desc {
            font-size: 11px;
            color: #475569;
            margin-top: 4px;
            padding-left: 68px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${app.name} ${api.title}</h2>
                <p>${api.subtitle}</p>
                <span class="badge">${api.badgePrefix}${data.version}</span>
            </div>
        </div>

        <div class="content">
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-label">${api.messageLabel}</div>
                    <div class="stat-value">${data.message}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${api.environmentLabel}</div>
                    <div class="stat-value">${data.environment}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${api.versionLabel}</div>
                    <div class="stat-value"><code>${data.version}</code></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${api.routesLabel}</div>
                    <div class="stat-value">${data.routes.length} ${api.endpointsSuffix}</div>
                </div>
            </div>

            <h3>${api.endpointsHeader}</h3>
            <ul>
                ${data.routes.map(route => {
        const safeMethod = getSafeMethod(route.method);
        const color = methodColor[safeMethod] ?? '#94a3b8';
        return `
                    <li class="endpoint-card">
                        <div class="endpoint-row">
                            <span class="endpoint-icon">${route.icon}</span>
                            <span class="method-badge" style="background:${color}18;color:${color};border:1px solid ${color}40;">
                                ${safeMethod}
                            </span>
                            <code>${route.path}</code>
                        </div>
                        ${route.description ? `<div class="endpoint-desc">${route.description}</div>` : ''}
                    </li>`;
    }).join('')}
            </ul>

            ${data.docsLink ? `
            <div class="btn-wrap">
                <a href="${data.docsLink}" class="button" target="_blank">${api.docsButtonText}</a>
            </div>` : ''}
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default APITemplate;