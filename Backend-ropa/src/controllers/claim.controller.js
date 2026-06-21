import { createClaimDB } from "../models/claim.model.js";

export const createClaim = async (req, res) => {
    try {
        const user_id = req.user?.id || null;

        const {
            full_name,
            email,
            phone,
            claim_type,
            description
        } = req.body;

        const claim = await createClaimDB(
            user_id,
            full_name,
            email,
            phone,
            claim_type,
            description
        );

        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar reclamo"
        });
    }
};
