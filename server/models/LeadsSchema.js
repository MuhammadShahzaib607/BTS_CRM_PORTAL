import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema({
    lastContactDate: {
        type: String,
        default: ""
    },
    lastSentMessage: {
        type: String,
        default: ""
    },
    responseType: {
        type: String,
        enum: ["Positive", "Natural", "NoResponse"],
        default: "NoResponse"
    }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
    companyName: {
        type: String,
        trim: true,
        default: ""
    },
    clientName: {
        type: String,
        trim: true,
        default: ""
    },
    designation: {
        type: String,
        default: ""
    },
    socialMediaUrl: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    emailAddress: {
        type: String,
        lowercase: true,
        default: ""
    },
    niche: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["New", "InProgress", "Rejected", "Confirm"],
        default: "New"
    },
    followUp: [followUpSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;