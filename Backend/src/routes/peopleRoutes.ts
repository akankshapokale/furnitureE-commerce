import express from "express";

import {
  getPeople,
  createPerson,
  updatePerson,
  deletePerson,
} from "../controllers/peopleController";
import { requireAdmin } from "../middleware/staff";

const router = express.Router();

router.use(requireAdmin);

router.get("/", getPeople);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
