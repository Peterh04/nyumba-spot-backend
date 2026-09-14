import Amenity from "../models/Amenity.js";
import Property from "../models/Property.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";
import { checkNumberFields } from "../utils/validation/checkNumberFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";

export const createPropertyAmenity = async (req, res) => {
  try {
    const { name } = req.body;

    const field = {
      name,
    };

    if (checkRequiredFields(field).length > 0)
      return res
        .status(400)
        .json({ message: "Amenity name field is required" });

    if (checkStringFields(field).length > 0)
      return res
        .status(400)
        .json({ message: "Amenity name should be a string" });

    const amenityExists = await Amenity.findOne({
      where: { name: name },
    });

    if (amenityExists)
      return res.status(400).json({ message: "Amenity already exists" });

    await Amenity.create({ name });
    res.status(201).json({ message: "Succesfully created the amenity" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to create amenity");
  }
};

export const updateAmenity = async (req, res) => {
  try {
    const amenityId = Number(req.params.amenityId);
    const { name } = req.body;

    const fields = {
      amenityId: amenityId,
      name,
    };

    const numberFields = {
      amenityId: amenityId,
    };

    const stringFields = {
      name,
    };
    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res
        .status(400)
        .json({ message: "Fields required", missingFields });

    if (checkIntegerFields(numberFields).length > 0)
      return res
        .status(400)
        .json({ message: "amenityId should be a whole number" });

    if (checkPositiveNumberFields(numberFields).length > 0)
      return res
        .status(400)
        .json({ message: "amenityId should be a positive whole number" });

    if (checkStringFields(stringFields).length > 0)
      return res
        .status(400)
        .json({ message: "Amenity name should be a string" });

    const amenity = await Amenity.findByPk(amenityId);
    if (!amenity) return res.status(404).json({ message: "Amenity not found" });

    const amenityExists = await Amenity.findOne({
      where: {
        id: { [Op.ne]: amenityId },
        name: name,
      },
    });

    if (amenityExists)
      return res
        .status(400)
        .json({ message: "Amennity with the same name already exists" });

    await amenity.update({ name: name });
    res.status(200).json({ message: "Successfully updated the amenity" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update Amenity" });
  }
};

export const deleteAmenity = async (req, res) => {
  try {
    const amenityId = Number(req.params.amenityId);

    const fields = {
      amenityId,
    };

    if (checkRequiredFields(fields).length > 0)
      return res.status(400).json({ message: "AmenityId is required" });

    if (checkIntegerFields(fields).length > 0)
      return res
        .status(400)
        .json({ message: "amenityId should be a whole number" });

    if (checkPositiveNumberFields(fields).length > 0)
      return res
        .status(400)
        .json({ message: "amenityId should be a positive whole number" });

    const amenity = await Amenity.findByPk(amenityId);
    if (!amenity) return res.status(404).json({ message: "Amenity not found" });

    await amenity.destroy();
    return res
      .status(200)
      .json({ message: "Successfully deleted the amenity" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete amenity" });
  }
};

export const getAllAmenities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = Number(req.query.page);
    const parsedPage = Number.isInteger(page) ? page : 1;

    const safeLimit = Math.max(1, Math.min(limit, 20));
    const safePage = Math.max(1, parsedPage);
    const safeOffset = (safePage - 1) * safeLimit;

    const results = await Amenity.findAndCountAll({
      limit: safeLimit,
      offset: safeOffset,
      order: ["id"],
    });

    const totalPages = Math.ceil(results.count / safeLimit);
    res.status(200).json({
      message: "Successfully fetched all amenities",
      amenities: {
        totalAmenities: results.count,
        totalPages,
        currentPage: safePage,
        amenities: results.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get Amenities",
    });
  }
};

export const getPropertyAmenities = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);

    const numberFields = {
      id: propertyId,
    };

    if (checkIntegerFields(numberFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a whole number" });

    if (checkPositiveNumberFields(numberFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a positive whole number" });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
      include: {
        model: Amenity,
        as: "amenities",
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const amenities = property.amenities;

    res.status(200).json({
      message: "Successfully fetched property's amenities",
      amenities,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve property's amenities" });
  }
};

export const addAmenityProperty = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { amenityIds } = req.body;

    const fields = {
      id: propertyId,
      amenityIds,
    };

    const simpleFields = {
      id: propertyId,
    };

    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (Array.isArray(amenityIds) === false)
      return res.status(400).json({ message: "amenityIds should be an Array" });

    const invalidNumberIds = amenityIds.filter(
      (id) => Number.isInteger(id) === false,
    );

    const invalidPositiveNumberIds = amenityIds.filter(
      (id) => typeof id !== "number" || id <= 0,
    );

    if (checkIntegerFields(simpleFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a whole number" });

    if (checkPositiveNumberFields(simpleFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a positive whole number" });

    if (amenityIds.length <= 0)
      return res.status(400).json({ message: "Add at least one amenity" });

    if (invalidNumberIds.length > 0)
      return res.status(400).json({
        message: "Amenities Id should be a whole number  ",
        invalidAmenityIds: invalidNumberIds,
      });

    if (invalidPositiveNumberIds.length > 0)
      return res.status(400).json({
        message: "Amenities Id should be a positive whole number ",
        invalidPositveIds: invalidPositiveNumberIds,
      });

    const setArr = new Set(amenityIds);
    if (amenityIds.length !== setArr.size)
      return res
        .status(400)
        .json({ message: "Can not add duplicates amenities" });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
      include: {
        model: Amenity,
        as: "amenities",
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const amenities = await Amenity.findAll({
      where: {
        id: amenityIds,
      },
    });

    if (amenities.length !== amenityIds.length)
      return res
        .status(400)
        .json({ message: "One or more amenities not found" });

    const existingAmenity = property.amenities
      .filter((amenity) => amenityIds.includes(amenity.id))
      .map((amenity) => amenity.id);

    if (existingAmenity.length > 0)
      return res.status(400).json({
        message: `${existingAmenity.length === 1 ? `amenity id ${existingAmenity[0]} ` : `amenities with ids [${existingAmenity}]`} already exists in this property`,
      });

    await property.addAmenities(amenityIds);
    res.status(200).json({
      message: `Successfully added ${amenities.length === 1 ? "amenity" : "amenities"} to the property`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add amenity to the property" });
  }
};

export const removeAmenityProperty = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { amenityIds } = req.body;

    const fields = {
      id: propertyId,
      amenityIds,
    };

    const simpleFields = {
      id: propertyId,
    };

    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (Array.isArray(amenityIds) === false)
      return res.status(400).json({ message: "amenityIds should be an Array" });

    const invalidNumberIds = amenityIds.filter(
      (id) => Number.isInteger(id) === false,
    );

    const invalidPositiveNumberIds = amenityIds.filter(
      (id) => typeof id !== "number" || id <= 0,
    );

    if (checkIntegerFields(simpleFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a whole number" });

    if (checkPositiveNumberFields(simpleFields).length > 0)
      return res
        .status(400)
        .json({ message: "propertyId should be a positive whole number" });

    if (amenityIds.length <= 0)
      return res.status(400).json({ message: "Add at least one amenity" });

    if (invalidNumberIds.length > 0)
      return res.status(400).json({
        message: "Amenities Id should be a whole number  ",
        invalidAmenityIds: invalidNumberIds,
      });

    if (invalidPositiveNumberIds.length > 0)
      return res.status(400).json({
        message: "Amenities Id should be a positive whole number ",
        invalidPositveIds: invalidPositiveNumberIds,
      });

    const setArr = new Set(amenityIds);
    if (amenityIds.length !== setArr.size)
      return res
        .status(400)
        .json({ message: "Can not remove duplicates amenities" });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
      include: {
        model: Amenity,
        as: "amenities",
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const amenities = await Amenity.findAll({
      where: {
        id: amenityIds,
      },
    });

    if (amenities.length !== amenityIds.length)
      return res
        .status(400)
        .json({ message: "One or more amenities not found" });

    const existingAmenitiesIds = property.amenities.map(
      (amenity) => amenity.id,
    );

    const missingAmenities = amenityIds.filter(
      (id) => !existingAmenitiesIds.includes(id),
    );

    if (missingAmenities.length > 0)
      return res.status(400).json({
        message: `${missingAmenities.length === 1 ? `amenity id ${missingAmenities[0]} does not exist in the property ` : `amenities with ids [${missingAmenities}] do not exist in the property`}`,
      });

    await property.removeAmenities(amenityIds);
    res.status(200).json({
      message: `Successfully removed ${amenities.length === 1 ? "amenity" : "amenities"} from the property`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove amenity or amenities from the property",
    });
  }
};
