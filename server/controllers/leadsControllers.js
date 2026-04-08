import Lead from "../models/LeadsSchema.js";
import { formatDate } from "../utils/formatedDate.js";
import { sendRes } from "../utils/responseHandler.js";

const addLead = async (req, res) => {
    try {
        const { 
            companyName, 
            clientName, 
            designation, 
            socialMediaUrl, 
            phone, 
            emailAddress, 
            niche, 
            status 
        } = req.body;

        const newLead = new Lead({
            companyName,
            clientName,
            designation,
            socialMediaUrl,
            phone,
            emailAddress,
            niche,
            status,
            followUp: [], 
            createdBy: req.user._id,
            date: formatDate()
        });

        const savedLead = await newLead.save();

        sendRes(res, 200, true, "Lead added successfully", savedLead);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const getSpecUserLeads = async (req, res) => {
    try {
        const userId = req.user._id;

        const userLeads = await Lead.find({ createdBy: userId }).sort({ createdAt: -1 });

        if (!userLeads || userLeads.length === 0) {
            return sendRes(res, 200, true, "No leads found for this user", []);
        }

        sendRes(res, 200, true, "User leads fetched successfully", userLeads);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const getAllLeads = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return sendRes(res, 403, false, "Access denied. Admin privileges required");
        }

        const allLeads = await Lead.find().sort({ createdAt: -1 });

        if (!allLeads || allLeads.length === 0) {
            return sendRes(res, 200, true, "No leads available in the system", []);
        }

        sendRes(res, 200, true, "All leads fetched successfully", allLeads);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const deleteSingleLead = async (req, res) => {
    try {
        const leadId = req.params.id;

        const lead = await Lead.findById(leadId);

        if (!lead) {
            return sendRes(res, 404, false, "Lead not found");
        }
        
        if (lead.createdBy.toString() !== req.user._id && !req.user.isAdmin) {
            return sendRes(res, 403, false, "You are not authorized to delete this lead");
        }

        await Lead.findByIdAndDelete(leadId);

        sendRes(res, 200, true, "Lead deleted successfully");

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const editSingleLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const updateData = req.body;

        const lead = await Lead.findById(leadId);

        if (!lead) {
            return sendRes(res, 404, false, "Lead not found");
        }

        if (lead.createdBy.toString() !== req.user._id && !req.user.isAdmin) {
            return sendRes(res, 403, false, "You are not authorized to edit this lead");
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        sendRes(res, 200, true, "Lead updated successfully", updatedLead);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const addFollowUp = async (req, res) => {
    try {
        const leadId = req.params.id;
        const { lastSentMessage, responseType, lastContactDate } = req.body;

        if (!lastSentMessage) {
            return sendRes(res, 400, false, "Message is required for follow-up");
        }

        let finalDate;
        if (lastContactDate) {
            const dateObj = new Date(lastContactDate);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            finalDate = `${day}-${month}-${year}`;
        } else {
            finalDate = formatDate(); 
        }

        const newFollowUp = {
            lastContactDate: finalDate,
            lastSentMessage,
            responseType: responseType || "NoResponse"
        };

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { $push: { followUp: newFollowUp } },
            { new: true } 
        );

        if (!updatedLead) {
            return sendRes(res, 404, false, "Lead not found");
        }

        sendRes(res, 200, true, "Follow-up added successfully", updatedLead);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const deleteFollowUp = async (req, res) => {
    try {
        const { leadId, followUpId } = req.body;

        if (!leadId || !followUpId) {
            return sendRes(res, 400, false, "Lead ID and Follow-up ID are required");
        }

        const lead = await Lead.findById(leadId);

        if (!lead) {
            return sendRes(res, 404, false, "Lead not found");
        }

        if (lead.createdBy.toString() !== req.user._id && !req.user.isAdmin) {
            return sendRes(res, 403, false, "You are not authorized to delete this follow-up");
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            { $pull: { followUp: { _id: followUpId } } },
            { new: true }
        );

        sendRes(res, 200, true, "Follow-up deleted successfully", updatedLead);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

const editFollowUp = async (req, res) => {
    try {
        const { leadId, followUpId, lastSentMessage, responseType, lastContactDate } = req.body;

        if (!leadId || !followUpId) {
            return sendRes(res, 400, false, "Lead ID and Follow-up ID are required");
        }

        const lead = await Lead.findById(leadId);

        if (!lead) {
            return sendRes(res, 404, false, "Lead not found");
        }

        if (lead.createdBy.toString() !== req.user._id && !req.user.isAdmin) {
            return sendRes(res, 403, false, "You are not authorized to edit this follow-up");
        }

        let updateFields = {};
        
        if (lastSentMessage !== undefined) updateFields["followUp.$[elem].lastSentMessage"] = lastSentMessage;
        if (responseType !== undefined) updateFields["followUp.$[elem].responseType"] = responseType;
        
        if (lastContactDate) {
            const dateObj = new Date(lastContactDate);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            
            updateFields["followUp.$[elem].lastContactDate"] = `${day}-${month}-${year}`;
        } else {
            updateFields["followUp.$[elem].lastContactDate"] = formatDate();
        }

        const updatedLead = await Lead.findOneAndUpdate(
            { _id: leadId },
            { $set: updateFields },
            { 
                arrayFilters: [{ "elem._id": followUpId }], 
                new: true 
            }
        );

        if (!updatedLead) {
            return sendRes(res, 404, false, "Follow-up not found");
        }

        sendRes(res, 200, true, "Follow-up updated successfully", updatedLead);

    } catch (error) {
        sendRes(res, 500, false, "Internal server error");
    }
}

export {
    addLead,
    getSpecUserLeads,
    getAllLeads,
    deleteSingleLead,
    editSingleLead,
    addFollowUp,
    deleteFollowUp,
    editFollowUp,
}