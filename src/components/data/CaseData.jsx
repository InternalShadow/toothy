const id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const caseNumber = [
  "123456",
  "789012",
  "345678",
  "901234",
  "567890",
  "234567",
  "890123",
  "456789",
  "012345",
  "678901",
];
const category = [
  "New Case",
  "Dental Images",
  "Image Upload",
  "Dental Impression",
  "Dental X-ray",
];
const status = ["Pending", "In Progress", "Completed", "In Review", "Uploaded"];
const submitted = [
  "2025-01-01",
  "2025-02-01",
  "2025-03-01",
  "2025-04-01",
  "2025-05-01",
  "2025-06-01",
  "2025-07-01",
  "2025-08-01",
  "2025-09-01",
  "2025-10-01",
];
const uploaded = [
  "2025-01-01",
  "2025-01-02",
  "2025-01-03",
  "2025-01-04",
  "2025-01-05",
  "2025-01-06",
  "2025-01-07",
  "2025-01-08",
  "2025-01-09",
  "2025-01-10",
];
const officeName = [
  "Office 1",
  "Office 2",
  "Office 3",
  "Office 4",
  "Office 5",
  "Office 6",
  "Office 7",
  "Office 8",
  "Office 9",
  "Office 10",
];

class CaseData {
  constructor(id, category, status, submitted, uploaded, officeName) {
    this.id = id;
    this.category = category;
    this.status = status;
    this.submitted = submitted;
    this.uploaded = uploaded;
    this.officeName = officeName;
  }
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomCase(id) {
  const cas = getRandomElement(caseNumber);
  const cat = getRandomElement(category);
  let stat = getRandomElement(status);
  let sub = getRandomElement(submitted);
  let up = getRandomElement(uploaded);
  const off = getRandomElement(officeName);

  if (cat === "New Case") {
    stat = "Pending";
    up = "N/A";
  }
  if (cat == "Dental Images" && stat == "Uploaded") {
    sub = "N/A";
  }
  if (cat == "Dental Images" && stat == "Pending") {
    sub = "N/A";
    up = "N/A";
  }
  if (cat == "Dental Images" && stat == "In Progress") {
    sub = "N/A";
    up = "N/A";
  }
  if (cat == "Image Uploaded") {
    stat = "Uploaded";
  }
  if (stat == "In Review" || stat == "Pending") {
    sub = "N/A";
    up = "N/A";
  }
  return {
    id,
    cas,
    cat,
    stat,
    sub,
    up,
    off,
  };
}

export function generateRandomCases(count = 10) {
  return Array.from({ length: count }, (_, i) => generateRandomCase(i + 1));
}

export const randomCases = generateRandomCases(10);
