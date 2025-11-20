/**
 * NEO DATABASE - Real Near-Earth Objects Detection Data
 * Classification and Impact Assessment System
 */

export const NEO_DATABASE = [
  // 0-20m range (15 objects)
  { name: "2014 SN142", diameter: 9.85, velocity: 80793.38, category: "0-20m" },
  { name: "2025 QW19", diameter: 9.19, velocity: 17061.84, category: "0-20m" },
  { name: "2020 HP1", diameter: 8.19, velocity: 51111.53, category: "0-20m" },
  { name: "2025 RN1", diameter: 3.42, velocity: 47527.39, category: "0-20m" },
  { name: "2025 RO1", diameter: 3.16, velocity: 42214.46, category: "0-20m" },
  { name: "2025 SD", diameter: 13.28, velocity: 25292.92, category: "0-20m" },
  { name: "2021 HC1", diameter: 10.96, velocity: 28580.37, category: "0-20m" },
  { name: "2024 YY5", diameter: 17.12, velocity: 9260.18, category: "0-20m" },
  { name: "2024 RR8", diameter: 9.28, velocity: 66830.05, category: "0-20m" },
  { name: "2021 RZ3", diameter: 14.71, velocity: 53603.35, category: "0-20m" },
  { name: "2022 RA", diameter: 11.36, velocity: 27137.76, category: "0-20m" },
  { name: "2008 DL4", diameter: 17.93, velocity: 17062.03, category: "0-20m" },
  { name: "2019 GE1", diameter: 17.12, velocity: 19568.73, category: "0-20m" },
  { name: "2025 QH16", diameter: 17.27, velocity: 29910.66, category: "0-20m" },
  { name: "2025 RF4", diameter: 20.76, velocity: 36403.65, category: "0-20m" },

  // 20-40m range (12 objects)
  { name: "2019 GJ4", diameter: 26.9, velocity: 39845.71, category: "20-40m" },
  { name: "2025 RV3", diameter: 20.13, velocity: 18190.89, category: "20-40m" },
  { name: "2025 RE3", diameter: 26.73, velocity: 27675.24, category: "20-40m" },
  { name: "2025 SC1", diameter: 24.65, velocity: 29207.92, category: "20-40m" },
  { name: "2025 RB", diameter: 20.87, velocity: 53120.65, category: "20-40m" },
  { name: "2025 RF", diameter: 22.47, velocity: 82642.43, category: "20-40m" },
  { name: "2025 RO4", diameter: 26.01, velocity: 28575.31, category: "20-40m" },
  { name: "2022 UV5", diameter: 31.59, velocity: 18209.82, category: "20-40m" },
  {
    name: "2013 XY20",
    diameter: 32.03,
    velocity: 10548.44,
    category: "20-40m",
  },
  { name: "2025 RT5", diameter: 31.23, velocity: 21160.62, category: "20-40m" },
  { name: "2024 EC4", diameter: 31.01, velocity: 62780.84, category: "20-40m" },
  { name: "2022 UY2", diameter: 30.59, velocity: 58500.31, category: "20-40m" },

  // 40-60m range (3 objects)
  { name: "2025 PJ3", diameter: 39.4, velocity: 42073.32, category: "40-60m" },
  { name: "2025 TR1", diameter: 45.87, velocity: 33832.44, category: "40-60m" },
  { name: "2025 RK", diameter: 47.16, velocity: 43767.19, category: "40-60m" },
  { name: "2025 RC3", diameter: 47.0, velocity: 43412.33, category: "40-60m" },
  { name: "2021 AN", diameter: 51.94, velocity: 66859.67, category: "40-60m" },
  {
    name: "2023 RG13",
    diameter: 55.15,
    velocity: 68028.86,
    category: "40-60m",
  },

  // 60-80m range (5 objects)
  { name: "2021 CD1", diameter: 64.2, velocity: 69564.57, category: "60-80m" },
  { name: "2022 KF", diameter: 52.18, velocity: 104674.68, category: "60-80m" },
  { name: "2025 SQ2", diameter: 66.89, velocity: 35920.2, category: "60-80m" },
  {
    name: "2025 QU11",
    diameter: 70.72,
    velocity: 33163.25,
    category: "60-80m",
  },
  { name: "2018 RZ7", diameter: 74.74, velocity: 37651.79, category: "60-80m" },

  // 80-100m range (4 objects)
  { name: "2025 RT1", diameter: 76.83, velocity: 53828.8, category: "80-100m" },
  {
    name: "2010 RJ43",
    diameter: 78.26,
    velocity: 38591.53,
    category: "80-100m",
  },
  {
    name: "2025 QA18",
    diameter: 85.02,
    velocity: 24385.8,
    category: "80-100m",
  },
  {
    name: "2025 QS5",
    diameter: 86.21,
    velocity: 47597.51,
    category: "80-100m",
  },

  // 100-120m range (3 objects)
  {
    name: "2018 RW1",
    diameter: 89.86,
    velocity: 25778.68,
    category: "100-120m",
  },
  {
    name: "2023 HO4",
    diameter: 98.98,
    velocity: 24580.15,
    category: "100-120m",
  },
  {
    name: "2002 RS129",
    diameter: 112.6,
    velocity: 56380.88,
    category: "100-120m",
  },

  // 120-140m range (2 objects)
  {
    name: "2025 OG24",
    diameter: 119.55,
    velocity: 65374.46,
    category: "120-140m",
  },
  {
    name: "2023 AA1",
    diameter: 129.28,
    velocity: 25349.91,
    category: "120-140m",
  },

  // 140-160m range (1 object)
  {
    name: "2025 QX3",
    diameter: 147.76,
    velocity: 40574.25,
    category: "140-160m",
  },

  // 160-180m range (2 objects)
  {
    name: "2003 SU84",
    diameter: 157.6,
    velocity: 52053.77,
    category: "160-180m",
  },
  {
    name: "2022 AL3",
    diameter: 174.4,
    velocity: 56282.73,
    category: "160-180m",
  },

  // 180-200m range (2 objects)
  {
    name: "2025 OE13",
    diameter: 184.31,
    velocity: 59687.33,
    category: "180-200m",
  },
  {
    name: "2025 SC42",
    diameter: 185.76,
    velocity: 42333.27,
    category: "180-200m",
  },

  // 220-240m range (1 object)
  {
    name: "2025 GQ",
    diameter: 229.9,
    velocity: 54241.93,
    category: "220-240m",
  },

  // 260-280m range (1 object)
  {
    name: "2017 QY34",
    diameter: 280.25,
    velocity: 99164.56,
    category: "260-280m",
  },

  // 280-300m range (1 object)
  {
    name: "2012 LF11",
    diameter: 298.91,
    velocity: 93479.54,
    category: "280-300m",
  },

  // 300-320m range (1 object)
  {
    name: "2024 NO5",
    diameter: 311.56,
    velocity: 36524.75,
    category: "300-320m",
  },

  // 380-400m+ range (1 object)
  { name: "2009 CA3", diameter: 401.37, velocity: 41673.71, category: "400m+" },

  // Additional objects
  { name: "1998 SD9", diameter: 65.39, velocity: 82121.8, category: "60-80m" },
  { name: "2025 SF7", diameter: 38.97, velocity: 39686.11, category: "20-40m" },
];

export const SIZE_CATEGORIES = {
  "0-20m": {
    label: "MINOR THREAT",
    color: "#FFB300",
    impact: "Typically burns up in atmosphere. Minimal ground damage.",
    frequency: "Multiple per year",
  },
  "20-40m": {
    label: "MODERATE THREAT",
    color: "#FF8C00",
    impact: "Airburst event. Local damage possible (6 MT equivalent).",
    frequency: "Every ~477 years",
  },
  "40-60m": {
    label: "SIGNIFICANT THREAT",
    color: "#FF6600",
    impact: "Regional damage. Airburst or surface impact.",
    frequency: "Every ~800 years",
  },
  "60-80m": {
    label: "MAJOR THREAT",
    color: "#FF3300",
    impact: "Extensive regional destruction (14 MT equivalent).",
    frequency: "Every ~993 years",
  },
  "80-100m": {
    label: "SEVERE THREAT",
    color: "#FF0000",
    impact: "Multi-regional catastrophe. Mass casualties likely.",
    frequency: "Every ~1,500 years",
  },
  "100-120m": {
    label: "CRITICAL THREAT",
    color: "#CC0000",
    impact: "Continental-scale devastation.",
    frequency: "Every ~2,500 years",
  },
  "120-140m": {
    label: "EXTINCTION-CLASS",
    color: "#990000",
    impact: "Global climate disruption. Civilization-threatening.",
    frequency: "Every ~5,000 years",
  },
  "140-160m": {
    label: "EXTINCTION-CLASS",
    color: "#660000",
    impact: "Mass extinction event probable.",
    frequency: "Every ~10,000 years",
  },
  "160-180m": {
    label: "EXTINCTION-CLASS",
    color: "#660000",
    impact: "Global devastation. Multi-year climate effects.",
    frequency: "Every ~15,000 years",
  },
  "180-200m": {
    label: "EXTINCTION-CLASS",
    color: "#330000",
    impact: "Civilizational collapse. Nuclear winter scenario.",
    frequency: "Every ~20,000 years",
  },
  "220-240m": {
    label: "EXTINCTION-CLASS",
    color: "#330000",
    impact: "Global mass extinction. Decade-long winter.",
    frequency: "Every ~50,000 years",
  },
  "260-280m": {
    label: "EXTINCTION-CLASS",
    color: "#330000",
    impact: "Total biosphere disruption.",
    frequency: "Every ~100,000 years",
  },
  "280-300m": {
    label: "EXTINCTION-CLASS",
    color: "#000000",
    impact: "Planetary-scale catastrophe.",
    frequency: "Every ~200,000 years",
  },
  "300-320m": {
    label: "EXTINCTION-CLASS",
    color: "#000000",
    impact: "Complete ecosystem collapse.",
    frequency: "Every ~500,000 years",
  },
  "400m+": {
    label: "EXTINCTION-CLASS",
    color: "#000000",
    impact: "Dinosaur-level extinction event.",
    frequency: "Every ~1,000,000 years",
  },
};

export function getNEOsByCategory(category) {
  return NEO_DATABASE.filter((neo) => neo.category === category);
}

export function getNEOStatistics() {
  const stats = {
    total: NEO_DATABASE.length,
    byCategory: {},
    smallest: null,
    largest: null,
    avgDiameter: 0,
    avgVelocity: 0,
  };

  // Group by category
  NEO_DATABASE.forEach((neo) => {
    if (!stats.byCategory[neo.category]) {
      stats.byCategory[neo.category] = 0;
    }
    stats.byCategory[neo.category]++;
  });

  // Find extremes
  stats.smallest = NEO_DATABASE.reduce((min, neo) =>
    neo.diameter < min.diameter ? neo : min
  );
  stats.largest = NEO_DATABASE.reduce((max, neo) =>
    neo.diameter > max.diameter ? neo : max
  );

  // Calculate averages
  const sumDiameter = NEO_DATABASE.reduce((sum, neo) => sum + neo.diameter, 0);
  const sumVelocity = NEO_DATABASE.reduce((sum, neo) => sum + neo.velocity, 0);
  stats.avgDiameter = sumDiameter / NEO_DATABASE.length;
  stats.avgVelocity = sumVelocity / NEO_DATABASE.length;

  return stats;
}
