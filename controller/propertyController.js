import { Op } from "sequelize";
import Property from "../models/Property.js";
import { checkBooleanFields } from "../utils/validation/checkInvalidBooleanFields.js";
import { checkNumberFields } from "../utils/validation/checkNumberFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRangeFields } from "../utils/validation/checkRangeFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";

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

    const propertyId = Number(req.params.propertyId);

    if (!Number.isInteger(propertyId)) {
      return res.status(400).json({
        message: "Property ID must be an integer.",
      });
    }

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

export const getAllProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    let page = Number(req.query.page);
    let parsedPage = Number.isInteger(page) ? page : 1;

    const safeLimit = Math.max(1, Math.min(limit, 30));
    const safePage = Math.max(1, parsedPage);
    const safeOffset = (safePage - 1) * safeLimit;

    const results = await Property.findAndCountAll({
      limit: safeLimit,
      offset: safeOffset,
    });

    const totalPages = Math.ceil(results.count / safeLimit);
    res.status(200).json({
      message: "Successfully fetched all properties",
      propertiesResults: {
        total_count_properties: results.count,
        totalPages,
        currentPage: safePage,
        properties: results.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get propperties" });
  }
};

export const getPropertyById = async (req, res) => {
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
        message: "propertyId must be a positive number",
      });

    const property = await Property.findByPk(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property does not exist" });

    return res
      .status(200)
      .json({ message: "Successfully fetched property", property });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get property" });
  }
};

export const searchProperty = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    let page = Number(req.query.page);
    const parsedPage = Number.isInteger(page) ? page : 1;

    const safeLimit = Math.max(1, Math.min(limit, 30));
    const safePage = Math.max(1, parsedPage);
    const safeOffset = (safePage - 1) * safeLimit;

    const { property_location, beds, baths, minPrice, maxPrice, sort } =
      req.query;

    if (beds !== undefined && beds === "")
      return res.status(400).json({ message: "Beds should not be empty" });
    if (baths !== undefined && baths === "")
      return res.status(400).json({ message: "Baths should not be empty" });
    if (minPrice !== undefined && minPrice === "")
      return res.status(400).json({ message: "minPrice should not be empty" });

    if (maxPrice !== undefined && maxPrice === "")
      return res.status(400).json({ message: "maxPrice should not be empty" });

    let safeBeds = beds !== undefined && beds !== "" ? Number(beds) : null;
    let safeBaths = baths !== undefined && baths !== "" ? Number(baths) : null;
    let safeMinPrice = minPrice !== undefined ? Number(minPrice) : null;
    let safeMaxPrice = maxPrice !== undefined ? Number(maxPrice) : null;

    const safePropertyLocation =
      property_location !== undefined ? property_location.trim() : null;

    const numberFields = {};

    const positiveFields = {};

    const integerFields = {};

    if (safeBeds !== null) {
      numberFields.beds = safeBeds;
      positiveFields.beds = safeBeds;
      integerFields.beds = safeBeds;
    }

    if (safeBaths !== null) {
      numberFields.baths = safeBaths;
      positiveFields.baths = safeBaths;
      integerFields.baths = safeBaths;
    }

    if (safeMinPrice !== null) {
      numberFields.minPrice = safeMinPrice;
      positiveFields.minPrice = safeMinPrice;
    }
    if (safeMaxPrice !== null) {
      numberFields.maxPrice = safeMaxPrice;
      positiveFields.maxPrice = safeMaxPrice;
    }

    const invalidNumberFields = checkNumberFields(numberFields);
    if (invalidNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid number fields",
        fields: invalidNumberFields,
      });

    const invalidPositiveNumberFields =
      checkPositiveNumberFields(positiveFields);
    if (invalidPositiveNumberFields.length > 0)
      return res.status(400).json({
        message: "Fields should be positive",
        fields: invalidPositiveNumberFields,
      });

    if (safeMinPrice === null && safeMaxPrice !== null) safeMinPrice = 1;
    if (safeMaxPrice === null && safeMinPrice !== null) safeMaxPrice = 4000000;

    const invalidIntegerFields = checkIntegerFields(integerFields);

    if (invalidIntegerFields.length > 0)
      return res.status(400).json({
        message: "Invalid integer fields",
        fields: invalidIntegerFields,
      });

    if (
      safeMinPrice !== null &&
      safeMaxPrice !== null &&
      safeMinPrice > safeMaxPrice
    )
      return res
        .status(400)
        .json({ message: "Min Price should be less than Max Price" });

    let whereClause = {};
    whereClause.price = {};

    if (safePropertyLocation) {
      whereClause.address = {
        [Op.iLike]: `%${safePropertyLocation}%`,
      };
    }

    if (safeBeds !== null) {
      whereClause.bedrooms = {
        [Op.eq]: safeBeds,
      };
    }

    if (safeBaths !== null) {
      whereClause.bathrooms = {
        [Op.eq]: safeBaths,
      };
    }

    if (safeMinPrice !== null) {
      whereClause.price[Op.gte] = safeMinPrice;
    }
    if (safeMaxPrice !== null) {
      whereClause.price[Op.lte] = safeMaxPrice;
    }

    let orderClause = [["createdAt", "DESC"]];

    //Need to add ratings too
    if (sort) {
      switch (sort) {
        case "beds":
          orderClause.unshift(["bedrooms", "DESC"]);
          break;
        case "baths":
          orderClause.unshift(["bathrooms", "DESC"]);
          break;
        case "lowPrice":
          orderClause.unshift(["price", "ASC"]);
          break;
        case "highPrice":
          orderClause.unshift(["price", "DESC"]);
          break;
      }
    }

    const filteredResults = await Property.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit: safeLimit,
      offset: safeOffset,
    });

    const totalPages = Math.max(
      1,
      Math.ceil(filteredResults.count / safeLimit),
    );
    res.status(200).json({
      message: "Successfully fetched filtered properties",
      propertiesResults: {
        total_count_properties: filteredResults.count,
        totalPages,
        currentPage: safePage,
        properties: filteredResults.rows,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get properties" });
  }
};
