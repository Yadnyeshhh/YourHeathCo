// src/data/mockData.js

export const navItems = [
  { name: 'Dashboard', icon: 'LayoutDashboard', active: true },
  { name: 'Billing & Claims', icon: 'CreditCard' },
  { name: 'Analytics', icon: 'BarChart' },
  { name: 'Alerts', icon: 'Bell' },
  { name: 'Settings', icon: 'Settings' },
  { name: 'Help', icon: 'HelpCircle' },
  { name: 'Logout', icon: 'LogOut' },
];

export const topCardsData = [
  { title: 'Meals', icon: 'Utensils', colorClass: 'card-icon-green' },
  { title: 'Medicines', icon: 'Heart', colorClass: 'card-icon-blue' },
  { title: 'Reports', value: '50', icon: 'DollarSign', colorClass: 'card-icon-purple' },
  { title: 'Presciptions', value: '75%', icon: 'CheckCircle', colorClass: 'card-icon-yellow' },
  { title: 'Bills', value: '84%', icon: 'UserPlus', colorClass: 'card-icon-red' },
];

export const programData = [
  { title: 'Blood-Pressure', count: 200 },
  { title: 'Heart-Rate', count: 180 },
  { title: 'Oxygen-Saturation', count: 150 },
  { title: 'Body-Temperature', count: 130 },
];

export const teamTodayData = [
  { name: 'John Doe', designation: 'Nutritionist', avatar: 'https://placehold.co/40x40/E0F2F7/000000?text=JD' },
  { name: 'Jane Smith', designation: 'Dietitian', avatar: 'https://placehold.co/40x40/FCE4EC/000000?text=JS' },
  { name: 'Peter Jones', designation: 'Therapist', avatar: 'https://placehold.co/40x40/FFF3E0/000000?text=PJ' },
  { name: 'Alice Brown', designation: 'Coach', avatar: 'https://placehold.co/40x40/E8F5E9/000000?text=AB' },
  { name: 'Bob White', designation: 'Consultant', avatar: 'https://placehold.co/40x40/F3E5F5/000000?text=BW' },
];

export const activityLogData = [
  { vehicleName: 'Ford F-150', visit: '1', condition: 'Good', status: 'Completed', date: '2023-10-26' },
  { vehicleName: 'Honda Civic', visit: '2', condition: 'Minor Scratches', status: 'Pending', date: '2023-10-25' },
  { vehicleName: 'Toyota Camry', visit: '1', condition: 'Excellent', status: 'Completed', date: '2023-10-24' },
  { vehicleName: 'Nissan Rogue', visit: '3', condition: 'Engine Issue', status: 'In Progress', date: '2023-10-23' },
  { vehicleName: 'BMW X5', visit: '1', condition: 'Good', status: 'Completed', date: '2023-10-22' },
];

export const patientMockData = {
  name: "Aarav Sharma",
  age: 32,
  gender: "Male",
  contact: "+91 98765 43210",
  bloodGroup: "O+",
  diagnosis: "Seasonal Allergies, Mild Hypertension",
  lastVisit: "2024-06-20",
};