// Login.ts
import  {style} from "./Style";
import FooterPartial from "./Footer";
import { TemplateData, formatTime } from "./Data";

interface LoginData {
  username: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ip?: string | string[];
  loginTime?: Date | string;
  location?: string;
  changePasswordLink?: string;
}

const LoginTemplate = (data: LoginData): string => {
  const { login, app } = TemplateData;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${login.subject} – ${app.name}</title>
    <style>${style}</style>
</head>
<body>
    <div class="container">
        <div class="header warning">
            <img src="${app.logo}" alt="${app.name}" />
            <div class="header-text">
                <h2>${login.title}</h2>
                <p>${login.subtitle}</p>
                <span class="badge" style="background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.35);color:#fde68a;">
                    ${login.badge}
                </span>
            </div>
        </div>

        <div class="content">
            <h1>${login.heading(data.username)}</h1>
            <p>${login.body(app.name)}</p>

            <div class="stat-grid">
                <div class="stat-card">
                    <div class="stat-label">${login.deviceLabel}</div>
                    <div class="stat-value">${data.deviceName ?? 'Unknown Device'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${login.browserLabel}</div>
                    <div class="stat-value">${data.browser ?? 'Unknown Browser'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${login.osLabel}</div>
                    <div class="stat-value">${data.os ?? 'Unknown OS'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${login.ipLabel}</div>
                    <div class="stat-value">${Array.isArray(data.ip) ? data.ip[0] : (data.ip ?? 'Unknown IP')}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">${login.timeLabel}</div>
                    <div class="stat-value">${formatTime(data.loginTime)}</div>
                </div>
                ${data.location ? `
                <div class="stat-card">
                    <div class="stat-label">${login.locationLabel}</div>
                    <div class="stat-value">${data.location}</div>
                </div>` : ''}
            </div>

            <div class="alert-box">
                ${login.wasYouText}<br/>
                ${login.wasNotYouText}
            </div>

            <div class="btn-wrap">
                <a href="${data.changePasswordLink ?? '#'}" class="button warning">
                    ${login.buttonText}
                </a>
            </div>
        </div>

        ${FooterPartial()}
    </div>
</body>
</html>`;
};

export default LoginTemplate;