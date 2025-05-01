import langing from '../../public/expensync/landing-page.png'
import react from '../../public/react.png'
import js from '../../public/js.webp'
import tailwind from '../../public/tailwind.png'
import firebase from '../../public/firebase.png'
import mui from '../../public/MUI.png'
import landing from '../../public/expensync/landing-page.png'
import login from '../../public/expensync/login-page.png'
import signup from '../../public/expensync/sign-up.png'
import dashboard from '../../public/expensync/dashboard.png'
import expenses from '../../public/expensync/expenses.png'
import income from '../../public/expensync/income.png'
import bills from '../../public/expensync/bills.png'
import analytics from '../../public/expensync/analytics.png'

export const projectData = [
  {
    name: "ExpenSync",
    subName: "Finance App",
    landingPage : langing,
    description : `Expensync is a sleek and minimal expense tracking app designed to help users gain control over their daily finances.
        It features a intuitive UI that allows users to easily add, edit, and delete expenses, categorize them, and instantly view spending summaries.`,
    stack: ['React', 'JavaScript', 'Tailwind', 'Firebase', 'MUI'],
    stackLogo: [react, js, tailwind, firebase, mui],
    projectURL: "https://expensync-nine.vercel.app/",
    github: null,
    key: ['🔐 User Authentication ', '📊 Real-Time Data ', "🛠️ Data Management ", '👤 Profile Settings '],
    subKey : ['Sign up and log in securely to the app.', 
              'Get real time data.', 
              'Add, remove, or update your data.', 
              'Update your profile name'],
    images: [landing, login, signup, dashboard, expenses, income, bills, analytics]
  }
]