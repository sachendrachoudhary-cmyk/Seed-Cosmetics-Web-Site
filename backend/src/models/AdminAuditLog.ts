import mongoose, { Schema, Document } from "mongoose";

export interface IAdminAuditLog extends Document {
  actorId?: mongoose.Types.ObjectId;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorEmail: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AdminAuditLogSchema.index({ createdAt: -1 });
AdminAuditLogSchema.index({ resource: 1, action: 1 });

export const AdminAuditLog = mongoose.model<IAdminAuditLog>("AdminAuditLog", AdminAuditLogSchema);
