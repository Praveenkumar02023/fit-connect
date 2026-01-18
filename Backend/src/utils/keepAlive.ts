import cron from 'node-cron';
import https from 'https';
import http from 'http';

export const startKeepAlive = () => {
    const backendUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
    console.log(backendUrl);
    if (!backendUrl) {
        console.log("Skipping keep-alive cron: No BACKEND_URL or RENDER_EXTERNAL_URL found.");
        return;
    }

    cron.schedule('*/10 * * * *', () => {
        console.log('Running keep-alive cron job');
        
        const protocol = backendUrl.startsWith('https') ? https : http;
        
        protocol.get(backendUrl + '/api/v1/health', (res) => {
            console.log(`Keep-alive ping status: ${res.statusCode}`);
        }).on('error', (e) => {
            console.error(`Keep-alive ping error: ${e.message}`);
        });
    });
};
