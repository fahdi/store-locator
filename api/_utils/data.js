/**
 * Data utilities for Vercel serverless functions
 */
import fs from "fs";
import path from "path";

// Get data path relative to the project root
const getDataPath = () => {
  return path.join(process.cwd(), 'server/data/malls.json');
};

export function loadMalls() {
  try {
    const dataPath = getDataPath();
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading malls data:', error);
    // Return default data if file doesn't exist
    return [
      {
        id: 1,
        name: "City Center Mall",
        latitude: 25.2854,
        longitude: 51.5310,
        isOpen: true,
        stores: [
          {
            id: 1,
            name: "Fashion Forward",
            type: "Clothing",
            isOpen: true,
            opening_hours: "10:00 AM - 10:00 PM"
          },
          {
            id: 2,
            name: "Tech Hub",
            type: "Electronics",
            isOpen: true,
            opening_hours: "9:00 AM - 11:00 PM"
          }
        ]
      },
      {
        id: 2,
        name: "Doha Festival City",
        latitude: 25.3548,
        longitude: 51.4326,
        isOpen: true,
        stores: [
          {
            id: 3,
            name: "Gourmet Corner",
            type: "Food & Dining",
            isOpen: false,
            opening_hours: "11:00 AM - 12:00 AM"
          },
          {
            id: 4,
            name: "Book Nook",
            type: "Books & Media",
            isOpen: true,
            opening_hours: "8:00 AM - 10:00 PM"
          }
        ]
      }
    ];
  }
}

export function saveMalls(malls) {
  try {
    const dataPath = getDataPath();
    fs.writeFileSync(dataPath, JSON.stringify(malls, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving malls data:', error);
    return false;
  }
}

export function generateStores(malls) {
  return malls.flatMap((mall) => 
    mall.stores.map((store) => ({
      ...store,
      mallId: mall.id,
      mallName: mall.name,
      latitude: mall.latitude + (Math.random() - 0.5) * 0.01,
      longitude: mall.longitude + (Math.random() - 0.5) * 0.01,
      description: store.description || `${store.type} store in ${mall.name}`,
      website: `https://${store.name.toLowerCase().replace(/\s+/g, '')}.com`
    }))
  );
}