import react from "../../public/react.png";
import js from "../../public/js.webp";
import tailwind from "../../public/tailwind.png";
import firebase from "../../public/firebase.png";
import mui from "../../public/MUI.png";
import landing from "../../public/expensync/landing-page.png";
import login from "../../public/expensync/login-page.png";
import signup from "../../public/expensync/sign-up.png";
import dashboard from "../../public/expensync/dashboard.png";
import expenses from "../../public/expensync/expenses.png";
import income from "../../public/expensync/income.png";
import bills from "../../public/expensync/bills.png";
import analytics from "../../public/expensync/analytics.png";
import ts from "../../public/ts.png";
import supabase from "../../public/supabase.webp";
import shadcn from "../../public/shadcn.png";
import motion from "../../public/motion.png";
import st_landing from "../../public/stafftrackr/st_landing.png";
import st_dashboard from "../../public/stafftrackr/st_dashboard.png";
import st_emplyoee from "../../public/stafftrackr/st_employee.png";
import st_payroll from "../../public/stafftrackr/st_payroll.png";
import st_attendance from "../../public/stafftrackr/st_attendance.png";

export const projectData = [
  {
    name: "StaffTrackr",
    subName: "HR & Payroll App",
    description: `StaffTrackr is a workforce management app where companies can onboard employees, track attendance, manage roles, and automate payroll based on flexible pay schedules. It features role-based access, real-time data handling, and a dedicated internal environment for platform administrators to manage system-wide settings.`,
    stack: ["NextJS", "TypeScript", "Tailwind", "Supabase", "Shadcn", "Motion"],
    stackLogo: [react, ts, tailwind, supabase, shadcn, motion],
    projectURL: "https://stafftrackr.vercel.app/",
    github: "https://github.com/Syddl",
    key: [
      "🏢 Company Management ",
      "👥 Employee & Role Management ",
      "🕒 Attendance Tracking ",
      "💰 Automated Payroll ",
      "📊 Payroll Summary Reports ",
      "🔐 Google Authentication ",
      "⚙️ Internal Environment (IE) ",
      "📦 Supabase Integration ",
      "🎯 Responsive UI",
    ],
    subKey: [
      "Add and configure company details, industries, and settings",
      "Assign roles (admin/employee) and manage user access",
      "Log daily attendance for accurate payroll",
      "Generate payroll based on weekly, semi-monthly, or monthly schedules",
      "View detailed breakdowns and summaries of employee pay",
      "Secure sign-in with Google using Supabase Auth",
      "Admin-only module to manage platform-wide settings",
      "Real-time database, auth, and storage support",
      "Built with Tailwind CSS for a clean and modern interface",
    ],
    images: [st_landing, st_dashboard, st_emplyoee, st_payroll, st_attendance],
  },
  {
    name: "ExpenSync",
    subName: "Finance App",
    description: `Expensync is a sleek and minimal expense tracking app designed to help users gain control over their daily finances.
        It features a intuitive UI that allows users to easily add, edit, and delete expenses, categorize them, and instantly view spending summaries.`,
    stack: ["React", "JavaScript", "Tailwind", "Firebase", "MUI"],
    stackLogo: [react, js, tailwind, firebase, mui],
    projectURL: "https://expensync-nine.vercel.app/",
    github: "https://github.com/Syddl/Expensync",
    key: [
      "🔐 User Authentication ",
      "📊 Real-Time Data ",
      "🛠️ Data Management ",
      "👤 Profile Settings ",
    ],
    subKey: [
      "Sign up and log in securely to the app.",
      "Get real time data.",
      "Add, remove, or update your data.",
      "Update your profile name",
    ],
    images: [
      landing,
      login,
      signup,
      dashboard,
      expenses,
      income,
      bills,
      analytics,
    ],
  },
];
