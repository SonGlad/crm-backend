const express = require("express");
const { authenticate } = require("../../middlewares/index");
const {
  getAllSource,
  getAllCountry,
  getAllRegion,
  getAllCity,
  getAllLastUpdate,
  getAllCreatedAt,
  getAllAgent,
  getAllNextCall,
  getAllResults,
} = require("../../controllers/finds/index");
const router = express.Router();

router.get("/source", authenticate, getAllSource.getAllSource);

router.get("/country", authenticate, getAllCountry.getAllCountry);

router.get("/region", authenticate, getAllRegion.getAllRegion);

router.get("/city", authenticate, getAllCity.getAllCity);

router.get("/lastupdate", authenticate, getAllLastUpdate.getAllLastUpdate);

router.get("/created", authenticate, getAllCreatedAt.getAllCreatedAt);

router.get("/agent", authenticate, getAllAgent.getAllAgent);

router.get("/nextcall", authenticate, getAllNextCall.getAllNextCall);

router.get("/results", authenticate, getAllResults.getAllResults);

module.exports = router;
