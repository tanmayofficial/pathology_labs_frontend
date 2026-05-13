import React from "react";
import {
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  DocumentCurrencyRupeeIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import { FaClipboardList, FaHospitalAlt } from "react-icons/fa";
import {
  HiDocumentReport,
  HiOutlineDocumentReport,
  HiReceiptTax,
} from "react-icons/hi";
import { TbFileReport, TbInvoice, TbReportAnalytics } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import { FcDepartment } from "react-icons/fc";
import { HospitalIcon } from "lucide-react";

export const sidebarOptions = [
  {
    name: "Patient Entry",
    path: "/patient-entry",
    icon: <ClipboardDocumentIcon className="h-5 w-5" />,
  },
  {
    name: "Doctor",
    path: "/doctor",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
  {
    name: "Test",
    path: "/test",
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
  },
  {
    name: "Test Group",
    path: "/test-group",
    icon: <FolderIcon className="h-5 w-5" />,
  },
  {
    name: "Patient",
    path: "/patient",
    icon: <HospitalIcon className="h-5 w-5" />,
  },
  {
    name: "Category",
    path: "/category",
    icon: <BiCategory className="h-5 w-5" />,
  },
  {
    name: "Department",
    path: "/department",
    icon: <FcDepartment className="h-5 w-5" />,
  },
  {
    name: "Ledger",
    path: "/ledger",
    icon: <DocumentCurrencyRupeeIcon className="h-5 w-5" />,
  },
  {
    name: "Patient Entry Report",
    path: "/patient-entry-report",
    icon: <FaHospitalAlt className="h-5 w-5" />,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: <TbInvoice className="h-5 w-5" />,
  },
  {
    name: "Test Report",
    path: "/test-report",
    icon: <HiDocumentReport className="h-5 w-5" />,
  },
  {
    name: "Ledger Report",
    path: "/ledger-report",
    icon: <TbReportAnalytics className="h-5 w-5" />,
  },
  {
    name: "Cash Register Report",
    path: "/cash-register",
    icon: <TbFileReport className="h-5 w-5" />,
  },
  {
    name: "Pending Report",
    path: "/pending-report",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
  },
  {
    name: "Complete Report",
    path: "/complete-report",
    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
  },
  {
    name: "Quick Payment",
    path: "/quick-payment",
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
  },
  {
    name: "Quick Receipt",
    path: "/receipt-report",
    icon: <HiReceiptTax className="h-5 w-5" />,
  },
  {
    name: "Bank Entry",
    path: "/bank-entry",
    icon: <BanknotesIcon className="h-5 w-5" />,
  },
  {
    name: "Outstanding",
    path: "/outstanding",
    icon: <ClipboardIcon className="h-5 w-5" />,
  },
  {
    name: "Today Register",
    path: "/today-register",
    icon: <HiOutlineDocumentReport className="h-5 w-5" />,
  },
  {
    name: "Balance List",
    path: "/balance-list",
    icon: <FaClipboardList className="h-5 w-5" />,
  },
];
