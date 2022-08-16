/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
//import BubbleChart from "@material-ui/icons/BubbleChart";

// core components/views for Admin layout
//import TableList from "views/TableList/TableList.js";
//import Typography from "views/Typography/Typography.js";
//import EmployeeTable from "views/Employee/Employee";
//import Icons from "views/Icons/Icons.js";
import OtherButton from "views/Other/Other";
import {
  Equalizer,
  Colorize,
  Publish,
  AccountBox,
  Category,
  MoreHoriz,
  Assignment,
} from "@material-ui/icons";
import MaterialTable from "views/Material/Material";
import FormulaTable from "views/Formula/Formula";
import UserProfile from "views/UserProfile/UserProfile";
import TaskDetailStaff from "views/Task/TaskTableStaff";
import Submit from "views/Approve/Submit";
import StaffProjectTable from "views/Project/StaffProject";

const staffRoutes = [
  {
    path: "/project",
    name: "Dự Án",
    rtlName: "لوحة القيادة",
    icon: Equalizer,
    component: StaffProjectTable,
    layout: "/staff",
  },
  {
    path: "/formula",
    name: "Công Thức",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Colorize,
    component: FormulaTable,
    layout: "/staff",
  },
  {
    path: "/profile",
    name: "Thông tin cá nhân",
    rtlName: "قائمة الجدول",
    icon: AccountBox,
    component: UserProfile,
    layout: "/staff",
  },
  {
    path: "/material",
    name: "Nguyên Liệu",
    rtlName: "طباعة",
    icon: Category,
    component: MaterialTable,
    layout: "/staff",
  },
  {
    path: "/task",
    name: "Công việc",
    rtlName: "قائمة الجدول",
    icon: Assignment,
    component: TaskDetailStaff,
    layout: "/staff",
  },
  {
    path: "/submit",
    name: "Nộp công Thức",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Publish,
    component: Submit,
    layout: "/staff",
  },
  {
    path: "/other",
    name: "Khác",
    rtlName: "الرموز",
    icon: MoreHoriz,
    component: OtherButton,
    layout: "/staff",
  },
];

export default staffRoutes;
