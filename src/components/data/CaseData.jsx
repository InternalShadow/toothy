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
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
];
const uploaded = [
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
  "2025-01-01",
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
  return new CaseData(
    id,
    getRandomElement(category),
    getRandomElement(status),
    getRandomElement(submitted),
    getRandomElement(uploaded),
    getRandomElement(officeName)
  );
}

export function generateRandomCases(count = 10) {
  return Array.from({ length: count }, (_, i) => generateRandomCase(i + 1));
}

export const randomCases = generateRandomCases(10);
