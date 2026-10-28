import Amenity from "./Amenity.js";
import EmailVerification from "./EmailVerification.js";
import ExternalIdentity from "./Externaldentity.js";
import MoveInCost from "./MoveInCost.js";
import OtpRateLimit from "./OtpRateLimit.js";
import Property from "./Property.js";
import PropertyMedia from "./PropertyMedia.js";
import PropertyMoveInCost from "./PropertyMoveInCost.js";
import Review from "./Review.js";
import RuleRequirement from "./RuleRequirement.js";
import User from "./User.js";

Property.hasMany(PropertyMedia, {
  foreignKey: "propertyId",
  as: "media",
});

PropertyMedia.belongsTo(Property, {
  foreignKey: "propertyId",
  as: "property",
});

Property.belongsToMany(Amenity, {
  through: "PropertyAmenity",
  as: "amenities",
  foreignKey: "propertyId",
  otherKey: "amenityId",
});

Amenity.belongsToMany(Property, {
  through: "PropertyAmenity",
  as: "properties",
  foreignKey: "amenityId",
  otherKey: "propertyId",
});

Property.belongsToMany(MoveInCost, {
  through: PropertyMoveInCost,
  as: "moveInCosts",
  foreignKey: "propertyId",
  otherKey: "moveCostId",
});

MoveInCost.belongsToMany(Property, {
  through: PropertyMoveInCost,
  as: "properties",
  foreignKey: "moveCostId",
  otherKey: "propertyId",
  onDelete: "CASCADE",
});

Property.belongsToMany(RuleRequirement, {
  through: "PropertyRuleRequirement",
  as: "ruleRequirements",
  foreignKey: "propertyId",
  otherKey: "ruleRequirementId",
});

RuleRequirement.belongsToMany(Property, {
  through: "PropertyRuleRequirement",
  as: "properties",
  foreignKey: "ruleRequirementId",
  otherKey: "propertyId",
  onDelete: "CASCADE",
});

User.hasMany(Review, {
  as: "reviews",
  foreignKey: "userId",
});

Review.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

Review.belongsTo(Property, {
  as: "property",
  foreignKey: "propertyId",
});

Property.hasMany(Review, {
  as: "reviews",
  foreignKey: "propertyId",
});

EmailVerification.belongsTo(User, {
  as: "user",
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: true,
  },
});

User.hasOne(EmailVerification, {
  as: "emailVerification",
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: true,
  },
  onDelete: "CASCADE",
});

OtpRateLimit.belongsTo(User, {
  as: "user",
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: true,
  },
});

User.hasOne(OtpRateLimit, {
  as: "rateLimit",
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: true,
  },
  onDelete: "CASCADE",
});

ExternalIdentity.belongsTo(User, {
  as: "user",
  foreignKey: {
    name: "userId",
  },
});

User.hasMany(ExternalIdentity, {
  as: "externalIdentities",
  foreignKey: {
    name: "userId",
  },
});
