import { Op } from "sequelize";
import Property from "../models/Property.js";
import RuleRequirement from "../models/RuleRequirement.js";
import checkIntegerFields from "../utils/validation/checkIntegerFields.js";
import { checkBooleanFields } from "../utils/validation/checkInvalidBooleanFields.js";
import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
import { checkStringFields } from "../utils/validation/checkStringFields.js";

export const createRequirementRules = async (req, res) => {
  try {
    const { title, type } = req.body;

    const fields = {
      title,
      type,
    };

    const missingFields = checkRequiredFields(fields);
    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    const invalidStringFields = checkStringFields(fields);

    if (invalidStringFields.length > 0) {
      return res.status(400).json({
        message: "Invalid string Fields",
        invalidStringFields,
      });
    }

    if (type !== "rule" && type !== "requirement")
      return res.status(400).json({
        message: "rule_requirement type should either be a rule or requirement",
      });

    const cleanedTitle = title.trim();

    const rule_requirement = await RuleRequirement.findOne({
      where: {
        title: {
          [Op.iLike]: cleanedTitle,
        },
      },
    });

    if (rule_requirement)
      return res
        .status(409)
        .json({ message: "rule_requirement aready exists" });

    await RuleRequirement.create({
      title: cleanedTitle,
      type,
    });

    res
      .status(201)
      .json({ message: "Successfully created the rule_requirement" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create requirement_rule" });
  }
};

export const editRequirementRules = async (req, res) => {
  try {
    const requirementRuleId = Number(req.params.requirementRuleId);
    const { title, type } = req.body;
    const fields = Object.keys(req.body);

    const requiredFields = {
      requirementRuleId,
    };

    const missingFields = checkRequiredFields(requiredFields);
    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (!fields.includes("title") && !fields.includes("type"))
      return res
        .status(400)
        .json({ message: "requirement_rule needs a title or type to update" });

    const numberFields = {
      requirementRuleId,
    };

    if (checkIntegerFields(numberFields).length > 0)
      return res
        .status(400)
        .json({ message: "requirementRuleId should be a whole number" });
    if (checkPositiveNumberFields(numberFields).length > 0)
      return res.status(400).json({
        message: "requirementRuleId should be a positive whole number",
      });

    const stringFields = {
      ...(fields.includes("title") ? { title } : {}),
      ...(fields.includes("type") ? { type } : {}),
    };

    const invalidStringFields = checkStringFields(stringFields);

    if (invalidStringFields.length > 0) {
      return res.status(400).json({
        message: "Invalid string Fields",
        invalidStringFields,
      });
    }

    if (fields.includes("type") && type !== "rule" && type !== "requirement")
      return res.status(400).json({
        message: "rule_requirement type should either be a rule or requirement",
      });

    const rule_requirement = await RuleRequirement.findByPk(requirementRuleId);

    if (!rule_requirement)
      return res
        .status(404)
        .json({ message: "rule_requirement does not exist" });

    const cleanedTitle = title ? title.trim() : "";

    if (
      fields.includes("title") &&
      rule_requirement.title.trim().toLowerCase() === cleanedTitle.toLowerCase()
    )
      return res
        .status(400)
        .json({ message: "rule_requirement can not have same title" });

    if (fields.includes("type") && rule_requirement.type === type)
      return res
        .status(400)
        .json({ message: "rule_requirement can not have same type" });

    if (fields.includes("title")) {
      const rule_requirement_exists = await RuleRequirement.findOne({
        where: {
          title: {
            [Op.iLike]: cleanedTitle,
          },
          id: {
            [Op.ne]: requirementRuleId,
          },
        },
      });

      if (rule_requirement_exists)
        return res
          .status(409)
          .json({ message: "A rule_requirement with the same title exists" });
    }

    await rule_requirement.update({
      ...(fields.includes("title") ? { title: cleanedTitle } : {}),
      ...(fields.includes("type") ? { type } : {}),
    });
    res.status(200).json({
      message: "Successfully updated requirement_rule",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to edit rule_requirement" });
  }
};

export const deleteRequirementRules = async (req, res) => {
  try {
    const { rules_requirements_ids } = req.body;

    const fields = {
      rules_requirements_ids,
    };

    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (Array.isArray(rules_requirements_ids) === false)
      return res
        .status(400)
        .json({ message: "rules_requirements_ids should be an Array" });

    const invalidNumberIds = rules_requirements_ids.filter(
      (id) => Number.isInteger(id) === false,
    );

    const invalidPositiveNumberIds = rules_requirements_ids.filter(
      (id) => typeof id !== "number" || id <= 0,
    );

    if (rules_requirements_ids.length <= 0)
      return res
        .status(400)
        .json({ message: "Add at least one requirement or rule" });

    if (invalidNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a whole number  ",
        invalidAmenityIds: invalidNumberIds,
      });

    if (invalidPositiveNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a positive whole number ",
        invalidPositveIds: invalidPositiveNumberIds,
      });

    const setArr = new Set(rules_requirements_ids);
    if (rules_requirements_ids.length !== setArr.size)
      return res
        .status(400)
        .json({ message: "Can not delete duplicates rules_requirements_ids" });

    const rules_requirements = await RuleRequirement.findAll({
      where: {
        id: rules_requirements_ids,
      },
    });

    const existingRulesRequirementsInSystem = rules_requirements.map(
      (rules_requirement) => rules_requirement.id,
    );

    const nonExistingRulesRequirements = rules_requirements_ids.filter(
      (rule_requirement_id) =>
        !existingRulesRequirementsInSystem.includes(rule_requirement_id),
    );

    if (rules_requirements.length !== rules_requirements_ids.length)
      return res.status(409).json({
        message: `${nonExistingRulesRequirements.length === 1 ? "Rule or requirement" : "Rules or requirements"} not found`,
        nonExistingRulesRequirements,
      });

    await RuleRequirement.destroy({
      where: {
        id: {
          [Op.in]: rules_requirements_ids,
        },
      },
    });
    res.status(200).json({
      message: `Successfully removed ${rules_requirements.length === 1 ? "rule_requirement" : "rules_requirements"} from the property`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete requirements_rules" });
  }
};

export const addPropertyRequirementRules = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { rules_requirements_ids } = req.body;

    const fields = {
      propertyId,
      rules_requirements_ids,
    };

    const simpleFields = {
      propertyId,
    };

    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (Array.isArray(rules_requirements_ids) === false)
      return res
        .status(400)
        .json({ message: "rules_requirements_ids should be an Array" });

    const invalidNumberIds = rules_requirements_ids.filter(
      (id) => Number.isInteger(id) === false,
    );

    const invalidPositiveNumberIds = rules_requirements_ids.filter(
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

    if (rules_requirements_ids.length <= 0)
      return res
        .status(400)
        .json({ message: "Add at least one requirement or rule" });

    if (invalidNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a whole number  ",
        invalidAmenityIds: invalidNumberIds,
      });

    if (invalidPositiveNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a positive whole number ",
        invalidPositveIds: invalidPositiveNumberIds,
      });

    const setArr = new Set(rules_requirements_ids);
    if (rules_requirements_ids.length !== setArr.size)
      return res
        .status(400)
        .json({ message: "Can not add duplicates rules_requirements_ids" });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
      include: {
        model: RuleRequirement,
        as: "ruleRequirements",
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const rules_requirements = await RuleRequirement.findAll({
      where: {
        id: rules_requirements_ids,
      },
    });

    const existingRulesRequirementsInSystem = rules_requirements.map(
      (rules_requirement) => rules_requirement.id,
    );

    const nonExistingRulesRequirements = rules_requirements_ids.filter(
      (rule_requirement_id) =>
        !existingRulesRequirementsInSystem.includes(rule_requirement_id),
    );

    if (rules_requirements.length !== rules_requirements_ids.length)
      return res.status(409).json({
        message: `${nonExistingRulesRequirements.length === 1 ? "Rule or requirement" : "Rules or requirements"} not found`,
        nonExistingRulesRequirements,
      });

    const existingRulesRequirements = property.ruleRequirements
      .filter((ruleRequirement) =>
        rules_requirements_ids.includes(ruleRequirement.id),
      )
      .map((ruleRequirement) => ruleRequirement.id);

    if (existingRulesRequirements.length > 0)
      return res.status(400).json({
        message: `${existingRulesRequirements.length === 1 ? `rule_requirement ${existingRulesRequirements[0]} ` : `rules_requirements with ids [${existingRulesRequirements}]`} already exists in this property`,
      });
    await property.addRuleRequirements(rules_requirements_ids);
    res.status(200).json({
      message: `Successfully added ${rules_requirements.length === 1 ? "rule_requirement" : "rules_requirements"} to the property`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add requirements and rules to the property",
    });
  }
};

export const removePropertyRequirementRules = async (req, res) => {
  try {
    const propertyId = Number(req.params.propertyId);
    const { rules_requirements_ids } = req.body;

    const fields = {
      propertyId,
      rules_requirements_ids,
    };

    const simpleFields = {
      propertyId,
    };

    const missingFields = checkRequiredFields(fields);

    if (missingFields.length > 0)
      return res.status(400).json({
        message: "Required fields missing",
        fields: missingFields,
      });

    if (Array.isArray(rules_requirements_ids) === false)
      return res
        .status(400)
        .json({ message: "rules_requirements_ids should be an Array" });

    const invalidNumberIds = rules_requirements_ids.filter(
      (id) => Number.isInteger(id) === false,
    );

    const invalidPositiveNumberIds = rules_requirements_ids.filter(
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

    if (rules_requirements_ids.length <= 0)
      return res
        .status(400)
        .json({ message: "Add at least one requirement or rule" });

    if (invalidNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a whole number  ",
        invalidAmenityIds: invalidNumberIds,
      });

    if (invalidPositiveNumberIds.length > 0)
      return res.status(400).json({
        message: "requirement_rules_id should be a positive whole number ",
        invalidPositveIds: invalidPositiveNumberIds,
      });

    const setArr = new Set(rules_requirements_ids);
    if (rules_requirements_ids.length !== setArr.size)
      return res
        .status(400)
        .json({ message: "Can not remove duplicates rules_requirements_ids" });

    const property = await Property.findByPk(propertyId, {
      attributes: ["id"],
      include: {
        model: RuleRequirement,
        as: "ruleRequirements",
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const rules_requirements = await RuleRequirement.findAll({
      where: {
        id: rules_requirements_ids,
      },
    });

    const existingRulesRequirementsInSystem = rules_requirements.map(
      (rules_requirement) => rules_requirement.id,
    );

    const nonExistingRulesRequirements = rules_requirements_ids.filter(
      (rule_requirement_id) =>
        !existingRulesRequirementsInSystem.includes(rule_requirement_id),
    );

    if (rules_requirements.length !== rules_requirements_ids.length)
      return res.status(409).json({
        message: `${nonExistingRulesRequirements.length === 1 ? "Rule or requirement" : "Rules or requirements"} not found`,
        nonExistingRulesRequirements,
      });

    const propertyRuleRequirementIds = property.ruleRequirements.map(
      (ruleRequirement) => ruleRequirement.id,
    );

    const missingRulesRequirements = rules_requirements_ids.filter(
      (ruleRequirement) =>
        !propertyRuleRequirementIds.includes(ruleRequirement),
    );

    if (missingRulesRequirements.length > 0)
      return res.status(400).json({
        message: `${missingRulesRequirements.length === 1 ? `rule_requirement ${missingRulesRequirements[0]} ` : `rules_requirements with ids [${missingRulesRequirements}]`} do not exist in this property`,
      });
    await property.removeRuleRequirements(rules_requirements_ids);
    res.status(200).json({
      message: `Successfully removed ${rules_requirements.length === 1 ? "rule_requirement" : "rules_requirements"} from the property`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove requirements or rules from the property",
    });
  }
};
