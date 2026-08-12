import Property from "../models/Property.js";
import { checkBooleanFields } from "../utils/validation/checkInvalidBooleanFields.js";
import { checkNumberFields } from "../utils/validation/checkNumberFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRangeFields } from "../utils/validation/checkRangeFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";

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
      unit,
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

    const propetiesTypes = [
      "Apartment",
      "Bungalow",
      "Maisonette",
      "Townhouse",
      "Villa",
      "Standalone House",
    ];

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

    const trimmedUnit = unit?.trim();

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

    if (invalidPositivePropertyValues.length > 0) {
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

    if (!propetiesTypes.includes(propertyType))
      return res.status(400).json({
        message:
          "Invalid Property type, Only types allowed : Apartment,Bungalow,Maisonette,Townhouse,Vill or Standalone House",
      });

    if (propertyType === "Apartment" && (unit == null || trimmedUnit === ""))
      return res
        .status(400)
        .json({ message: "Unit identifier is required for apartments" });

    const existingProperty =
      propertyType === "Apartment"
        ? await Property.findOne({
            where: { unit: trimmedUnit, name: name, address: address },
          })
        : await Property.findOne({
            where: { name, address, latitude, longitude },
          });

    if (existingProperty)
      return res.status(400).json({ message: "Similar property unit exists" });

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
      unit: trimmedUnit,
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
    const { description, price, furnished } = req.body;

    const propertyId = Number(req.params.id);
    if (!propertyId.isInteger(req.params.id))
      return res.status(400).json({
        message: "Property ID must be an integer.",
      });

    const allowedFields = ["description", "price", "furnished"];
    const fields = Object.keys(req.body);

    if (fields.length === 0)
      return res.status(400).json({ message: "No fields provided for update" });

    const invalidFields = fields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0)
      return res.status(400).json({
        message: "Invalid updatable fields",
        fields: invalidFields,
      });

    const updateFields = {};

    const numberField = {
      id: propertyId,
      ...(fields.includes("price") ? { price } : {}),
    };

    const stringFields = {
      ...(fields.includes("description") ? { description } : {}),
    };

    const booleanFields = {
      ...(fields.includes("furnished") ? { furnished } : {}),
    };

    const invalidNumberFields = checkNumberFields(numberField);
    const invalidStringFields = checkStringFields(stringFields);
    const invalidPositiveNumberFields = checkPositiveNumberFields(numberField);
    const invalidBooleanPropertyFields = checkBooleanFields(booleanFields);

    if (invalidNumberFields.includes("id")) {
      return res.status(400).json({
        message: "propertyId should be a number.",
      });
    }

    if (invalidPositiveNumberFields.includes("id")) {
      return res.status(400).json({
        message: "Invalid poitive propertyId number.",
      });
    }

    if (invalidNumberFields.includes("price")) {
      return res.status(400).json({
        message: "Price should be a number.",
      });
    }

    if (invalidPositiveNumberFields.includes("price")) {
      return res.status(400).json({
        message: "Invalid poitive price number.",
      });
    }

    if (invalidStringFields.length > 0) {
      return res.status(400).json({
        message: "Description must be a non empty string",
      });
    }

    if (invalidBooleanPropertyFields.length > 0) {
      return res.status(400).json({
        message: "furnished should be a boolean",
      });
    }

    if (fields.includes("description")) updateFields.description = description;
    if (fields.includes("price")) updateFields.price = price;
    if (fields.includes("furnished")) updateFields.furnished = furnished;

    const property = await Property.findByPk(propertyId);

    if (!property)
      return res.status(404).json({ message: "Property not found!" });

    await property.update(updateFields);

    res.status(200).json({
      message: "Successfully updated the property",
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
    const propertyId = Number(req.params.propertyId);

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
      message: "Successfully deleted property",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete property",
    });
  }
};
