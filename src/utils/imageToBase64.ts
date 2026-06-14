// src/utils/imageToBase64.ts
import fs   from 'fs';
import path from 'path';

export const imageToBase64 = (filename: string): string => {
    const filePath = path.join(__dirname, '../../public', filename);

    if (!fs.existsSync(filePath)) {
        console.warn(`[imageToBase64] File not found: ${filePath}`);
        return '';
    }
    const ext      = path.extname(filename).replace('.', '');
    const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
    const base64   = fs.readFileSync(filePath).toString('base64');
    console.log(`[imageToBase64] Converted ${filename} to base64`);
    return `data:${mimeType};base64,${base64}`;
};