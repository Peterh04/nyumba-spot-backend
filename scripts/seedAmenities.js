import sequelize from "../config/db.js";
import PropertyAmenity from "../models/Amenity.js";

const amenities = [
  // Internet & Connectivity
  { name: "Wi-Fi" },

  // Parking & Transport
  { name: "Parking" },

  // Water
  { name: "Borehole" },

  // Electricity
  { name: "Generator" },
  { name: "Solar Power" },

  // Security
  { name: "Security" },
  { name: "CCTV" },
  { name: "Electric Fence" },
  { name: "Controlled Access" },
  { name: "Security Alarm" },

  // Building Features
  { name: "Lift" },
  { name: "Wheelchair Accessible" },

  // Outdoor
  { name: "Balcony" },
  { name: "Garden" },
  { name: "Terrace" },
  { name: "Rooftop Area" },

  // Recreation
  { name: "Swimming Pool" },
  { name: "Gym" },
  { name: "Play Area" },
  { name: "BBQ Area" },

  // Laundry
  { name: "Laundry Area" },

  // Climate
  { name: "Air Conditioning" },

  // Lifestyle

  { name: "Pet Friendly" },

  // Extras
  { name: "Servant Quarter (DSQ)" },
  { name: "Fire Safety Equipment" },
];

try {
  await sequelize.authenticate();

  await PropertyAmenity.bulkCreate(amenities, {
    ignoreDuplicates: true,
  });

  console.log("Amenities seeded successfully.");
} catch (error) {
  console.error(error);
}
