import http from 'http';
import './jobs/cron/schedule_embeddings';
import './jobs/cron/schedule_reference_embeddings';
declare const app: import("express-serve-static-core").Express;
export declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default app;
//# sourceMappingURL=app.d.ts.map