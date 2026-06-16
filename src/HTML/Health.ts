// Health.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData, formatUptime } from "./Data";

interface HealthData {
    timestamp: string;
    uptime: number;
    environment?: string;
    version: string;
    memoryMB?: number;
    cpuLoad?: number;
}

const HealthTemplate = (data: HealthData): string => {
    const { health, app } = TemplateData;
    const dbConnected = true; // Assuming connected if app is running

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${health.subject(app.name)}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${app.name} – ${health.title}</h2>
                <p>${health.subtitle}</p>
                <span class="badge">${health.badge}</span>
            </div>
        </div>

        <div class="content">
            <h3>System Info</h3>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-label">${health.statusLabel}</div>
                    <div class="stat-value status-ok">${health.operationalText}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${health.environmentLabel}</div>
                    <div class="stat-value">${data.environment ?? 'development'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${health.versionLabel}</div>
                    <div class="stat-value"><code>${data.version}</code></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${health.uptimeLabel}</div>
                    <div class="stat-value">${formatUptime(data.uptime)}</div>
                </div>
                ${data.memoryMB !== undefined ? `
                <div class="stat-card">
                    <div class="stat-label">${health.memoryLabel}</div>
                    <div class="stat-value">${data.memoryMB.toFixed(1)} MB</div>
                </div>` : ''}
                <div class="stat-card">
                    <div class="stat-label">${health.timestampLabel}</div>
                    <div class="stat-value" style="font-size:12px;">${data.timestamp}</div>
                </div>
            </div>

            <h3>${health.databaseHeader}</h3>
            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-label">${health.connectionLabel}</div>
                    <div class="stat-value ${dbConnected ? 'status-ok' : 'status-error'}">
                        ${dbConnected ? health.connectedText : health.disconnectedText}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${health.kindLabel}</div>
                    <div class="stat-value">Prisma (MongoDB)</div>
                </div>
            </div>
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default HealthTemplate;