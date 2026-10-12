// import Review from "../models/Review.js";
// import User from "../models/User.js";
// import { checkPositiveNumberFields } from "../utils/validation/checkPositiveNumberFields.js";
// import { checkRequiredFields } from "../utils/validation/checkRequiredFields.js";
// import { checkStringFields } from "../utils/validation/checkStringFields.js";
// import checkIntegerFields from "../utils/validation/checkIntegerFields.js";

// export const createReview = async (req, rss) => {
//   try {
//     const propertyId = req.params.propertyId;
//     const { comment, rating, userId } = req.body;

//     const requiredFields = {
//       propertyId,
//       comment,
//       rating,
//       userId,
//     };

//     const numberFields = {
//       propertyId,
//       rating,
//       userId,
//     };

//     const stringFields = {
//       comment,
//     };

//     const invalidRequiredFields = checkRequiredFields(requiredFields);

//     if (invalidRequiredFields.length > 0)
//       return res.status(400).json({
//         message: "Missing required fields",
//         fields: invalidRequiredFields,
//       });

//     const invalidIntegerNumberFields = checkIntegerFields(numberFields);
//     const invalidPositiveNumberFields = checkPositiveNumberFields(numberFields);
//     const invaidStringFields = checkStringFields(stringFields);

//     if (invalidIntegerNumberFields.length > 0)
//       return res.status(400).json({
//         message: "Invalid whole number moveCostId",
//         fields: invalidIntegerNumberFields,
//       });

//     if (invalidPositiveNumberFields.length > 0)
//       return res.status(400).json({
//         message: "Invalid positve number moveCostId",
//         fields: invalidPositiveNumberFields,
//       });

//     if (invaidStringFields.length > 0)
//       return res.status(400).json({
//         message: "Comment should be a valid string",
//         fields: invaidStringFields,
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to crete review" });
//   }
// };
