import Amenity from "./Amenity.js";
import MoveInCost from "./MoveInCost.js";
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
