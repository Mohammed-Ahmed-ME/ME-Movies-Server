// src/Models/AuditingModel.ts
import mongoose, { Document, Schema } from 'mongoose';

interface AuditRequest {
    ip:      string;
    agent:   string;
    method:  string;
    os:      string;
    browser: string;
    device:  string;
    path:    string;
    params:  Record<string, unknown>;
    query:   Record<string, unknown>;
    body:    Record<string, unknown>;
    headers: Record<string, unknown>;
}

interface AuditResponse {
    status:    number;
    message:   string;
    error?:    string;
    data:     Record<string, unknown>;
    duration:  number;   // ms — useful for spotting slow endpoints
}

export interface IAuditDocument extends Document {
    userId?:   mongoose.Types.ObjectId;   // optional — unauthenticated requests have none
    action:    string;
    request:   AuditRequest;
    response:  AuditResponse;
    createdAt: Date;
}

const AuditRequestSchema = new Schema<AuditRequest>(
    {
        ip:      { type: String, default: 'unknown' },
        agent:   { type: String, default: 'unknown' },
        os:      { type: String, default: 'unknown' },
        browser: { type: String, default: 'unknown' },
        device:  { type: String, default: 'unknown' },
        method:  { type: String, required: true },
        path:    { type: String, required: true },
        params:  { type: Schema.Types.Mixed, default: {} },
        query:   { type: Schema.Types.Mixed, default: {} },
        body:    { type: Schema.Types.Mixed, default: {} },
        headers: { type: Schema.Types.Mixed, default: {} },
    },
    { _id: false }
);

const AuditResponseSchema = new Schema<AuditResponse>(
    {
        status:   { type: Number, required: true },
        message:  { type: String, default: '' },
        data:     { type: Schema.Types.Mixed, default: {} },
        error:    { type: String },
        duration: { type: Number, default: 0 },   // ms
    },
    { _id: false }
);

const AuditingSchema = new Schema<IAuditDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref:  'UserModel',
            // optional — no required:true, no unique:true
        },
        action:   { type: String, required: true },
        request:  { type: AuditRequestSchema,  required: true },
        response: { type: AuditResponseSchema, required: true },
    },
    { timestamps: true }
);

/* ─────────────────────────────────────────
   Indexes
   ───────────────────────────────────────── */

// Auto-delete after 30 days
AuditingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

// Fast queries: all requests by a user, sorted by time
AuditingSchema.index({ userId: 1, createdAt: -1 });

// Fast queries: all 500 errors, all POST /api/auth/login attempts etc.
AuditingSchema.index({ 'response.status': 1, action: 1 });
const AuditingModel = mongoose.models.Audit || mongoose.model('Audit', AuditingSchema);

export default AuditingModel;