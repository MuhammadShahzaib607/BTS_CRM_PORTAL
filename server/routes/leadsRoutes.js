import express from "express"
import { verifyToken } from "../utils/verifyToken.js"
import { 
    addLead,
    getSpecUserLeads,
    getAllLeads,
    deleteSingleLead,
    editSingleLead,
    addFollowUp,
    deleteFollowUp,
    editFollowUp,
 } from "../controllers/leadsControllers.js";

const router = express.Router()

router.post("/add-lead", verifyToken, addLead);
router.get("/my-leads", verifyToken, getSpecUserLeads);
router.get("/all-leads", verifyToken, getAllLeads);
router.delete("/delete-lead/:id", verifyToken, deleteSingleLead);
router.put("/edit-lead/:id", verifyToken, editSingleLead);
router.post("/add-followup/:id", verifyToken, addFollowUp);
router.delete("/delete-followup", verifyToken, deleteFollowUp);
router.put("/edit-followup", verifyToken, editFollowUp);

export default router;