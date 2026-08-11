import Property from "../models/Property.js";
import { checkBooleanFields } from "../utils/validation/checkInvalidBooleanFields.js";
import { checkNumberFields } from "../utils/validation/checkNumberFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRangeFields } from "../utils/validation/checkRangeFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";

export const createProperty = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      bedrooms,
      bathrooms,
      size,
      propertyType,
      furnished,
      parking,
      floorLevel,
      address,
      latitude,
      longitude,
    } = req.body;

    const requiredPropertyValues = {
      name,
      description,
      price,
      bedrooms,
      bathrooms,
      size,
      propertyType,
      furnished,
      parking,
      floorLevel,
      address,
      latitude,
      longitude,
    };

    const booleanPropertyValues = {
      furnished,
      parking,
    };

    const numberPropertyValues = {
      price,
      bedrooms,
      bathrooms,
      size,
      floorLevel,
      latitude,
      longitude,
    };

    const positivePropertyValues = {
      price,
      bedrooms,
      bathrooms,
      size,
    };

    const rangePropertyValues = {
      bedrooms: { value: bedrooms, min: 1, max: 10 },
      bathrooms: { value: bathrooms, min: 1, max: 10 },
      price: { value: price, min: 1, max: 1000000 },
      size: { value: size, min: 1, max: 10000 },
    };

    const missingRequiredPropertyValues = checkRequiredFields(
      requiredPropertyValues,
    );

    const invalidBooleanPropertyValues = checkBooleanFields(
      booleanPropertyValues,
    );

    const invalidNumberPropertyValues = checkNumberFields(numberPropertyValues);

    const invalidPositivePropertyValues = checkPositiveNumberFields(
      positivePropertyValues,
    );

    const invalidPropertyRangeValues = checkRangeFields(rangePropertyValues);

    if (missingRequiredPropertyValues.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingRequiredPropertyValues,
      });

    if (invalidBooleanPropertyValues.length > 0)
      return res.status(400).json({
        message: "Invalid boolean fields.",
        fields: invalidBooleanPropertyValues,
      });

    if (invalidNumberPropertyValues.length > 0) {
      return res.status(400).json({
        message: "Invalid number fields.",
        fields: invalidNumberPropertyValues,
      });
    }

    if (invalidPositvePropertyValues.length > 0) {
      return res.status(400).json({
        message: "Invalid positve number fields.",
        fields: invalidPositivePropertyValues,
      });
    }

    if (Object.keys(invalidPropertyRangeValues).length > 0) {
      return res.status(400).json({
        message: "Invalid property range values.",
        fields: invalidPropertyRangeValues,
      });
    }

    const property = await Property.create({
      name,
      description,
      price,
      bedrooms,
      bathrooms,
      size,
      propertyType,
      furnished,
      parking,
      floorLevel,
      address,
      latitude,
      longitude,
    });

    res
      .status(201)
      .json({ message: "Successfully created the property", property });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create property",
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { description, price };
    const propertyId = Number(req.params.id);

    const updateField = {};

    const numberField = {
      id: propertyId,
    };

    const update;
    if (checkNumberFields(numberField).length > 0)
      return res.status(400).json({
        message: "propertyId should be a number.",
      });

    if (checkPositiveNumberFields(numberField).length > 0)
      return res.status(400).json({
        message: "Invalid poitive propertyId number.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to edit property",
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const propertyId = Number(req.params.id);

    const numberField = {
      id: propertyId,
    };
    if (checkNumberFields(numberField).length > 0)
      return res.status(400).json({
        message: "propertyId should be a number.",
      });

    if (checkPositiveNumberFields(numberField).length > 0)
      return res.status(400).json({
        message: "Invalid poitive propertyId number.",
      });

    const property = await Property.findByPk(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    await property.destroy();

    res.status(200).json({
      message: "Successfully destroyed property",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete property",
    });
  }
};
