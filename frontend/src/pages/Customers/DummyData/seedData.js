const FIRST = ["Rahul","Priya","Aman","Sneha","Vikram","Meera","Aakash","Divya","Rohit","Neha","Karan","Pooja","Arjun","Simran","Ravi","Anjali","Suresh","Kavya","Nikhil","Tanvi","Siddharth","Ishita","Manish","Deepa","Rajesh"];
const LAST  = ["Sharma","Singh","Gupta","Mehta","Nair","Joshi","Kumar","Patel","Verma","Reddy","Iyer","Malhotra","Chopra","Bose","Agarwal","Rao","Shah","Mishra","Sinha","Pandey"];

export const PERSONAS = [
  { label: "Morning Regular", color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
  { label: "Premium Diner",   color: "#7C3AED", bg: "#F5F3FF", dot: "#7C3AED" },
  { label: "Weekend Warrior", color: "#D97706", bg: "#FFFBEB", dot: "#D97706" },
  { label: "Ghost Diner",     color: "#6B7280", bg: "#F9FAFB", dot: "#6B7280" },
  { label: "Night Snacker",   color: "#2563EB", bg: "#EFF6FF", dot: "#2563EB" },
];

export const CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Surat"
];

export const GENDERS = [
  "Male",
  "Female",
  "Other"
];

export const STATUSES = ["Active", "Active", "Active", "Dormant", "High Value", "At Risk"];

function seeded(n) { return Math.abs(Math.sin(n * 9301 + 49297) * 233280) % 1; }

export function makeCustomers(count = 120) {
  return Array.from({ length: count }, (_, i) => {
    const s   = seeded(i);
    const s2  = seeded(i + 500);
    const s3  = seeded(i + 1000);
    const s4  = seeded(i + 1500);
    const first = FIRST[Math.floor(s  * FIRST.length)];
    const last  = LAST [Math.floor(s2 * LAST.length)];
    const orders = Math.floor(s3 * 25) + 1;
    const spend  = Math.floor(s4 * 12000) + 400;
    const daysAgo = Math.floor(seeded(i + 2000) * 90);
    const persona  = PERSONAS[Math.floor(seeded(i + 3000) * PERSONAS.length)];
    const statusRaw = STATUSES[Math.floor(seeded(i + 4000) * STATUSES.length)];
    const city = CITIES[Math.floor(seeded(i + 5000) * CITIES.length)];
    const gender = GENDERS[Math.floor(seeded(i + 6000) * GENDERS.length)];
    const age = Math.floor(seeded(i + 7000) * 43) + 18; 
    const status = daysAgo > 45 ? "Dormant" : orders > 15 ? "High Value" : daysAgo > 25 ? "At Risk" : statusRaw;
    const rfm = `${Math.floor(seeded(i+5)*5)+1}${Math.floor(seeded(i+6)*5)+1}${Math.floor(seeded(i+7)*5)+1}`;
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
      phone: `+91 ${Math.floor(seeded(i+8)*9000000000 + 1000000000)}`,
      city,
      gender,
      age,
      orders,
      spend,
      daysAgo,
      persona,
      status,
      rfm,
      avgOrder: Math.floor(spend / orders),
    };
  });
}