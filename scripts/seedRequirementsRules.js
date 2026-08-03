import sequelize from "../config/db.js";
import RuleRequirement from "../models/RuleRequirement.js";

const RuleRequirements = [
  // Requirements

  {
    title: "National ID required for guests",
    type: "requirement",
  },
  {
    title: "Proof of income required",
    type: "requirement",
  },

  // Rules

  {
    title: "No smoking outdoors",
    type: "rule",
  },
  {
    title: "No pets allowed",
    type: "rule",
  },
  {
    title: "No subletting",
    type: "rule",
  },

  {
    title: "Quiet hours must be observed",
    type: "rule",
  },
  {
    title: "Keep shared areas clean",
    type: "rule",
  },
  {
    title: "Dispose of waste properly",
    type: "rule",
  },

  {
    title: "Parking only in designated areas",
    type: "rule",
  },
  {
    title: "Do not block emergency exits",
    type: "rule",
  },
  {
    title: "Report maintenance issues promptly",
    type: "rule",
  },
  {
    title: "Follow apartment or estate management regulations",
    type: "rule",
  },
  {
    title: "No excessive noise",
    type: "rule",
  },
  {
    title: "No unauthorized alterations to the property",
    type: "rule",
  },
  {
    title: "Respect neighbors and shared facilities",
    type: "rule",
  },
];

try {
  await sequelize.authenticate();

  await RuleRequirement.bulkCreate(RuleRequirements, {
    ignoreDuplicates: true,
  });

  console.log("RuleRequirement seeded successfully");
} catch (error) {
  console.error(error);
}
