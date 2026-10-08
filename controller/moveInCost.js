import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkBooleanFields } from "../utils/validation/checkInvalidBooleanFields.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";

import moveInCost from "../models/MoveInCost.js";
import PropertyMoveInCost from "../models/PropertyMoveInCost.js";
import { Op, where } from "sequelize";
import Property from "../models/Property.js";
import MoveInCost from "../models/MoveInCost.js";
import { checkNumberFields } from "../utils/validation/checkNumberFields.js";

export const createMoveInCost = async (req, res) => {
  try {
    const { title } = req.body;

    const fields = {
      title,
    };

    const invalidRequiredFields = checkRequiredFields(fields);
    const invaidStringFields = checkStringFields(fields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing title of the moveInCost",
        fields: invalidRequiredFields,
      });

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Title of the moveInCost should be a valid string",
        fields: invaidStringFields,
      });

    const cleanedTitle = title.trim();

    const existingMoveInCost = await MoveInCost.findOne({
      where: {
        title: {
          [Op.iLike]: cleanedTitle,
        },
      },
    });
    if (existingMoveInCost)
      return res.status(409).json({ message: "MoveInCost already exists" });

    await MoveInCost.create({ title: cleanedTitle });
    return res
      .status(201)
      .json({ message: "Successfully created the move in cost" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to create moveInCost" });
  }
};

export const deleteMoveInCosts = async (req, res) => {
  try {
    const { moveInCostsIds } = req.body;

    const fields = {
      moveInCostsIds,
    };

    const invalidRequiredFields = checkRequiredFields(fields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing moveInCostsIds field",
        fields: invalidRequiredFields,
      });

    if (!Array.isArray(moveInCostsIds))
      return res
        .status(400)
        .json({ message: "moveInCostsIds should be an arrray" });

    if (moveInCostsIds.length === 0)
      return res
        .status(400)
        .json({ message: "moveInCostsIds should not be an empty array" });

    if (new Set(moveInCostsIds).size !== moveInCostsIds.length)
      return res
        .status(400)
        .json({ message: "MoveInCosts contains duplicates" });

    const invalidIntegerMoveCostsIds = checkIntegerFields(moveInCostsIds);

    const invalidPositiveMoveCostsIds =
      checkPositiveNumberFields(moveInCostsIds);

    if (invalidIntegerMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid whole number ids",
        fields: invalidIntegerMoveCostsIds,
      });

    if (invalidPositiveMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid positve number ids",
        fields: invalidPositiveMoveCostsIds,
      });

    const existingMoveInCosts = await moveInCost.findAll({
      where: {
        id: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    const existingMoveInCostsIds = existingMoveInCosts.map(
      (existingMoveInCost) => existingMoveInCost.id,
    );

    const missingMoveInCostsIds = moveInCostsIds.filter(
      (moveInCostsId) => !existingMoveInCostsIds.includes(moveInCostsId),
    );

    if (missingMoveInCostsIds.length > 0)
      return res.status(404).json({
        message: `${missingMoveInCostsIds.length === 1 ? "MoveInCost does not exists" : "MoveInCosts do not exist"}`,
        missingMoveInCosts: missingMoveInCostsIds,
      });

    await MoveInCost.destroy({
      where: {
        id: {
          [Op.in]: moveInCostsIds,
        },
      },
    });
    res.status(200).json({
      message: `Successfully deleted ${moveInCostsIds.length === 1 ? "moveInCost" : "moveInCosts"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete moveInCost" });
  }
};

export const editMoveInCost = async (req, res) => {
  try {
    const moveCostId = Number(req.params.moveInCostId);
    const { title } = req.body;

    const requiredFields = {
      moveCostId,
      title,
    };

    const numberFields = {
      moveCostId,
    };

    const stringFields = {
      title,
    };

    const invalidRequiredFields = checkRequiredFields(requiredFields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    const invalidIntegerNumberFields = checkIntegerFields(numberFields);
    const invalidPositiveNumberFields = checkPositiveNumberFields(numberFields);
    const invaidStringFields = checkStringFields(stringFields);

    if (invalidIntegerNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid whole number moveCostId",
        fields: invalidIntegerNumberFields,
      });

    if (invalidPositiveNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid positve number moveCostId",
        fields: invalidPositiveNumberFields,
      });

    if (invaidStringFields.length > 0)
      return res.status(400).json({
        message: "Title of the moveInCost should be a valid string",
        fields: invaidStringFields,
      });

    const existingMoveInCost = await MoveInCost.findByPk(moveCostId);

    if (!existingMoveInCost)
      return res.status(404).json({ message: "MoveInCost does not exist" });

    const extractedTitle = existingMoveInCost.title.trim().toLowerCase();
    const cleanedTitle = title.trim();

    if (cleanedTitle.toLowerCase() === extractedTitle)
      return res
        .status(409)
        .json({ message: "MoveInCost contains the same title" });

    await existingMoveInCost.update({
      title: cleanedTitle,
    });

    res.status(200).json({ message: "Successfully updated MoveInCost" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to edit MoveInCost" });
  }
};

export const addPropertyMoveInCost = async (req, res) => {
  try {
    const { moveInCosts } = req.body;
    const propertyId = Number(req.params.propertyId);

    const requiredFields = {
      propertyId,
      moveInCosts,
    };

    const invalidRequiredFields = checkRequiredFields(requiredFields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    if (!Array.isArray(moveInCosts))
      return res
        .status(400)
        .json({ message: "MoveInCosts should be an arrray" });

    if (moveInCosts.length === 0)
      return res
        .status(400)
        .json({ message: "MoveInCosts should not be an empty array" });

    if (
      !moveInCosts.every(
        (moveInCost) =>
          moveInCost !== null &&
          typeof moveInCost === "object" &&
          "moveCostId" in moveInCost &&
          "refundable" in moveInCost &&
          "amount" in moveInCost,
      )
    )
      return res.status(400).json({
        message:
          "MoveInCosts should be an array of objects with each object containing these properties : moveCostId,refundable,amount",
      });

    const moveInCostsIds = moveInCosts.map(
      (moveInCost) => moveInCost.moveCostId,
    );

    if (new Set(moveInCostsIds).size !== moveInCostsIds.length)
      return res
        .status(400)
        .json({ message: "MoveInCosts contains duplicates" });
    const moveInCostsRefundValues = moveInCosts.map(
      (moveInCost) => moveInCost.refundable,
    );
    const moveInCostsAmounts = moveInCosts.map(
      (moveInCost) => moveInCost.amount,
    );

    const numberFields = {
      propertyId,
    };

    const invalidRequiredMoveInCostsId = checkRequiredFields(moveInCostsIds);
    const invalidRequiredMoveInCostsAmount =
      checkRequiredFields(moveInCostsAmounts);
    const missingRefundableFields = checkRequiredFields(
      moveInCostsRefundValues,
    );
    const invalidIntegerNumberFields = checkIntegerFields(numberFields);
    const invalidIntegerMoveCostsIds = checkIntegerFields(moveInCostsIds);
    const invalidPositiveNumberFields = checkPositiveNumberFields(numberFields);
    const invalidPositiveMoveCostsIds =
      checkPositiveNumberFields(moveInCostsIds);

    const invalidPositiveMoveInCostsAmounts =
      checkPositiveNumberFields(moveInCostsAmounts);
    const invalidBooleanMoveInRefund = checkBooleanFields(
      moveInCostsRefundValues,
    );

    if (invalidRequiredMoveInCostsId.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost ids",
        fields: invalidRequiredMoveInCostsId,
      });

    if (invalidRequiredMoveInCostsAmount.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost amount fields",
        fields: invalidRequiredMoveInCostsAmount,
      });

    if (missingRefundableFields.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost boolean",
        fields: missingRefundableFields,
      });

    if (invalidIntegerNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid whole number fields",
        fields: invalidIntegerNumberFields,
      });

    if (invalidIntegerMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid whole number ids",
        fields: invalidIntegerMoveCostsIds,
      });

    if (invalidPositiveNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid positve number fields",
        fields: invalidPositiveNumberFields,
      });

    if (invalidPositiveMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid positve number ids",
        fields: invalidPositiveMoveCostsIds,
      });

    if (invalidPositiveMoveInCostsAmounts.length > 0)
      return res.status(400).json({
        message: "Invalid positve whole number fields",
        fields: invalidPositiveMoveInCostsAmounts,
      });

    if (invalidBooleanMoveInRefund.length > 0)
      return res.status(400).json({
        message: "Invalid refundable boolean fields",
        fields: invalidBooleanMoveInRefund,
      });

    const existingMoveInCosts = await moveInCost.findAll({
      where: {
        id: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    const existingMoveInCostsIds = existingMoveInCosts.map(
      (existingMoveInCost) => existingMoveInCost.id,
    );

    const missingMoveInCostsIds = moveInCostsIds.filter(
      (moveInCostsId) => !existingMoveInCostsIds.includes(moveInCostsId),
    );

    if (missingMoveInCostsIds.length > 0)
      return res.status(404).json({
        message: `${missingMoveInCostsIds.length === 1 ? "MoveInCost does not exists" : "MoveInCosts do not exist"}`,
        missingMoveInCosts: missingMoveInCostsIds,
      });

    const existingMoveInCostsInProperty = await PropertyMoveInCost.findAll({
      where: {
        propertyId,
        moveCostId: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    if (existingMoveInCostsInProperty.length > 0)
      return res.status(409).json({
        message: "Property already contains these MoveInCosts",
        existingMoveInCostsInProperty,
      });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
    });

    if (!property)
      return res.status(404).json({ message: "Property does not exist" });

    const transformedMoveInCosts = moveInCosts.map((moveInCost) => ({
      propertyId: propertyId,
      moveCostId: moveInCost.moveCostId,
      refundable: moveInCost.refundable,
      amount: moveInCost.amount,
    }));

    await PropertyMoveInCost.bulkCreate(transformedMoveInCosts);
    res.status(201).json({ message: "Successfully added moveInCosts" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to add move In cost to property" });
  }
};

export const deletePropertyMoveInCost = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { moveInCostsIds } = req.body;

    const requiredFields = {
      propertyId,
      moveInCostsIds,
    };

    const invalidRequiredFields = checkRequiredFields(requiredFields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    if (!Array.isArray(moveInCostsIds))
      return res
        .status(400)
        .json({ message: "moveInCostsIds should be an arrray" });

    if (moveInCostsIds.length === 0)
      return res
        .status(400)
        .json({ message: "moveInCostsIds should not be an empty array" });

    if (new Set(moveInCostsIds).size !== moveInCostsIds.length)
      return res
        .status(400)
        .json({ message: "MoveInCosts contains duplicates" });

    const numberFields = {
      propertyId,
    };

    const invalidIntegerNumberFields = checkIntegerFields(numberFields);
    const invalidIntegerMoveCostsIds = checkIntegerFields(moveInCostsIds);
    const invalidPositiveNumberFields = checkPositiveNumberFields(numberFields);
    const invalidPositiveMoveCostsIds =
      checkPositiveNumberFields(moveInCostsIds);

    if (invalidIntegerNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid whole number fields",
        fields: invalidIntegerNumberFields,
      });

    if (invalidIntegerMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid whole number ids",
        fields: invalidIntegerMoveCostsIds,
      });

    if (invalidPositiveNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid positve number fields",
        fields: invalidPositiveNumberFields,
      });

    if (invalidPositiveMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid positve number ids",
        fields: invalidPositiveMoveCostsIds,
      });

    const existingMoveInCosts = await moveInCost.findAll({
      where: {
        id: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    const existingMoveInCostsIds = existingMoveInCosts.map(
      (existingMoveInCost) => existingMoveInCost.id,
    );

    const missingMoveInCostsIds = moveInCostsIds.filter(
      (moveInCostsId) => !existingMoveInCostsIds.includes(moveInCostsId),
    );

    if (missingMoveInCostsIds.length > 0)
      return res.status(404).json({
        message: `${missingMoveInCostsIds.length === 1 ? "MoveInCost does not exists" : "MoveInCosts do not exist"}`,
        missingMoveInCosts: missingMoveInCostsIds,
      });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
    });

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const existingMoveInCostsInProperty = await PropertyMoveInCost.findAll({
      where: {
        propertyId,
        moveCostId: {
          [Op.in]: moveInCostsIds,
        },
      },
      attributes: ["moveCostId"],
    });

    const existingIds = existingMoveInCostsInProperty.map(
      (existingMoveInCostInProperty) => existingMoveInCostInProperty.moveCostId,
    );

    const nonExistingIds = moveInCostsIds.filter(
      (id) => !existingIds.includes(id),
    );
    if (nonExistingIds.length > 0)
      return res.status(404).json({
        message: "These moveInCosts do not exist in the property",
        nonExistingIds,
      });

    await PropertyMoveInCost.destroy({
      where: {
        propertyId,
        moveCostId: {
          [Op.in]: moveInCostsIds,
        },
      },
    });
    res
      .status(204)
      .json({ message: "Successfully deleted moveInCosts from property" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to delete moveInCost from property" });
  }
};

export const editPropertyMoveInCost = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { moveInCosts } = req.body;

    const requiredFields = {
      propertyId,
      moveInCosts,
    };

    const invalidRequiredFields = checkRequiredFields(requiredFields);

    if (invalidRequiredFields.length > 0)
      return res.status(400).json({
        message: "Missing required fields",
        fields: invalidRequiredFields,
      });

    if (!Array.isArray(moveInCosts))
      return res
        .status(400)
        .json({ message: "MoveInCosts should be an arrray" });

    if (moveInCosts.length === 0)
      return res
        .status(400)
        .json({ message: "MoveInCosts should not be an empty array" });

    if (
      !moveInCosts.every(
        (moveInCost) =>
          moveInCost !== null &&
          typeof moveInCost === "object" &&
          "moveCostId" in moveInCost &&
          "refundable" in moveInCost &&
          "amount" in moveInCost,
      )
    )
      return res.status(400).json({
        message:
          "MoveInCosts should be an array of objects with each object containing these properties : moveCostId,refundable,amount",
      });

    const moveInCostsIds = moveInCosts.map(
      (moveInCost) => moveInCost.moveCostId,
    );

    if (new Set(moveInCostsIds).size !== moveInCostsIds.length)
      return res
        .status(400)
        .json({ message: "MoveInCosts contains duplicates" });
    const moveInCostsRefundValues = moveInCosts.map(
      (moveInCost) => moveInCost.refundable,
    );
    const moveInCostsAmounts = moveInCosts.map(
      (moveInCost) => moveInCost.amount,
    );

    const numberFields = {
      propertyId,
    };

    const invalidRequiredMoveInCostsId = checkRequiredFields(moveInCostsIds);
    const invalidRequiredMoveInCostsAmount =
      checkRequiredFields(moveInCostsAmounts);
    const missingRefundableFields = checkRequiredFields(
      moveInCostsRefundValues,
    );
    const invalidIntegerNumberFields = checkIntegerFields(numberFields);
    const invalidIntegerMoveCostsIds = checkIntegerFields(moveInCostsIds);
    const invalidPositiveNumberFields = checkPositiveNumberFields(numberFields);
    const invalidPositiveMoveCostsIds =
      checkPositiveNumberFields(moveInCostsIds);

    const invalidPositiveMoveInCostsAmounts =
      checkPositiveNumberFields(moveInCostsAmounts);
    const invalidBooleanMoveInRefund = checkBooleanFields(
      moveInCostsRefundValues,
    );

    if (invalidRequiredMoveInCostsId.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost ids",
        fields: invalidRequiredMoveInCostsId,
      });

    if (invalidRequiredMoveInCostsAmount.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost amount fields",
        fields: invalidRequiredMoveInCostsAmount,
      });

    if (missingRefundableFields.length > 0)
      return res.status(400).json({
        message: "Missing moveInCost boolean",
        fields: missingRefundableFields,
      });

    if (invalidIntegerNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid whole number fields",
        fields: invalidIntegerNumberFields,
      });

    if (invalidIntegerMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid whole number ids",
        fields: invalidIntegerMoveCostsIds,
      });

    if (invalidPositiveNumberFields.length > 0)
      return res.status(400).json({
        message: "Invalid positve number fields",
        fields: invalidPositiveNumberFields,
      });

    if (invalidPositiveMoveCostsIds.length > 0)
      return res.status(400).json({
        message: "Invalid positve number ids",
        fields: invalidPositiveMoveCostsIds,
      });

    if (invalidPositiveMoveInCostsAmounts.length > 0)
      return res.status(400).json({
        message: "Invalid positve whole number fields",
        fields: invalidPositiveMoveInCostsAmounts,
      });

    if (invalidBooleanMoveInRefund.length > 0)
      return res.status(400).json({
        message: "Invalid refundable boolean fields",
        fields: invalidBooleanMoveInRefund,
      });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
    });

    if (!property)
      return res.status(404).json({ message: "Property does not exist" });

    const existingMoveInCosts = await moveInCost.findAll({
      where: {
        id: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    const existingMoveInCostsIds = existingMoveInCosts.map(
      (existingMoveInCost) => existingMoveInCost.id,
    );

    const missingMoveInCostsIds = moveInCostsIds.filter(
      (moveInCostsId) => !existingMoveInCostsIds.includes(moveInCostsId),
    );

    if (missingMoveInCostsIds.length > 0)
      return res.status(404).json({
        message: `${missingMoveInCostsIds.length === 1 ? "MoveInCost does not exist" : "MoveInCosts do not exist"}`,
        missingMoveInCosts: missingMoveInCostsIds,
      });

    const existingMoveInCostsInProperty = await PropertyMoveInCost.findAll({
      where: {
        propertyId,
        moveCostId: {
          [Op.in]: moveInCostsIds,
        },
      },
    });

    const existingMoveInCostsIdsInProperty = existingMoveInCostsInProperty.map(
      (existingMoveInCostInProperty) => existingMoveInCostInProperty.moveCostId,
    );

    const nonExistingMoveInCostsInProperty = moveInCostsIds.filter(
      (moveInCostId) =>
        !existingMoveInCostsIdsInProperty.includes(moveInCostId),
    );

    if (nonExistingMoveInCostsInProperty.length > 0)
      return res.status(404).json({
        message: `${nonExistingMoveInCostsInProperty.length === 1 ? "This move in cost with id does" : "Theese move in costs with the ids do"} not exist in the property `,
        nonExistingMoveInCostsInProperty,
      });

    const transformedMoveInCosts = moveInCosts.map((moveInCost) => ({
      propertyId: propertyId,
      moveCostId: moveInCost.moveCostId,
      refundable: moveInCost.refundable,
      amount: moveInCost.amount,
    }));

    await PropertyMoveInCost.bulkCreate(transformedMoveInCosts, {
      updateOnDuplicate: ["refundable", "amount"],
    });
    res.status(200).json({ message: "Successfully updated moveInCosts" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update moveInCosts" });
  }
};
