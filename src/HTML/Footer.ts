// Footer.ts
import { TemplateData } from "./Data";

const FooterPartial = (): string => {
    const { app } = TemplateData;
    const currentYear = new Date().getFullYear();
    return `
    <div class="footer">
        <img src="${app.meLogo}" alt="${app.meName}" class="footer-logo" />
        <p class="footer-copy">© ${currentYear} <strong>${app.meName}</strong>. All rights reserved.</p>
        <div class="footer-links">
            ${app.phone ? `<a href="tel:${app.phone}">📞 ${app.phone}</a>` : ''}
            ${app.phone && app.email ? '<span class="footer-dot">•</span>' : ''}
            ${app.email ? `<a href="mailto:${app.email}">✉️ ${app.email}</a>` : ''}
            ${(app.phone || app.email) && app.url ? '<span class="footer-dot">•</span>' : ''}
            ${app.url ? `<a href="${app.url}">🌐 ${app.name}</a>` : ''}
        </div>
    </div>
    `;
};

export default FooterPartial;