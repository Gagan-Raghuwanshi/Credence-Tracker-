import express from "express";
import { deviceAllHistory, deviceStopage, deviceTripsWithRoute, showOnlyDeviceTripStartingPointAndEndingPoint } from "../controllers/DeviceHistory.controller.js";

const router = express.Router();

router.get("/device-all-history/:deviceId", deviceAllHistory);
router.get("/device-trips-with-route", deviceTripsWithRoute);
router.get("/show-only-device-trips-startingpoint-endingpoint", showOnlyDeviceTripStartingPointAndEndingPoint);
router.get("/device-stopage", deviceStopage);

export default router;
