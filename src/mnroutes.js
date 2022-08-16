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
//import UserProfile from "views/UserProfile/UserProfile.js";
//import TableList from "views/TableList/TableList.js";
//import Typography from "views/Typography/Typography.js";
//import Icons from "views/Icons/Icons.js";
import OtherButton from "views/Other/Other";
import {
  //AssistantOutlined,
  //GavelSharp,
  //Person,
  AccountBox,
  MoreHoriz,
  Assignment,
  PlaylistAddCheck,
  Category,
  Publish,
  Equalizer,
  BubbleChart,
} from "@material-ui/icons";
import MaterialTable from "views/Material/Material";
import Task from "views/Task/TaskTable";
//import FormulaTable from "views/Formula/Formula";
import Approve from "views/Approve/Approve";
import UserProfile from "views/UserProfile/UserProfile";
import ProjectTable from "views/Project/Project";
import StandardTable from "views/FormulaTesting/TestStandard";
import Dashboard from "views/Dashboard/Dashboard";

const managerRoutes = [
  {
    path: "/dashboard",
    name: "Thống kê",
    rtlName: "قائمة الجدول",
    icon: Equalizer,
    component: Dashboard,
    layout: "/manager",
  },
  {
    path: "/project",
    name: "Dự Án",
    rtlName: "لوحة القيادة",
    icon: BubbleChart,
    component: ProjectTable,
    layout: "/manager",
  },
  {
    path: "/material",
    name: "Nguyên Liệu",
    rtlName: "طباعة",
    icon: Category,
    component: MaterialTable,
    layout: "/manager",
  },
  {
    path: "/quality_standard",
    name: "Bộ kiểm tra chất lượng",
    icon: PlaylistAddCheck,
    component: StandardTable,
    layout: "/manager",
  },
  {
    path: "/profile",
    name: "Thông tin cá nhân",
    rtlName: "قائمة الجدول",
    icon: AccountBox,
    component: UserProfile,
    layout: "/manager",
  },
  {
    path: "/approve",
    name: "Duyệt công thức",
    rtlName: "قائمة الجدول",
    icon: Publish,
    component: Approve,
    layout: "/manager",
  },
  {
    path: "/task",
    name: "Công việc",
    rtlName: "قائمة الجدول",
    icon: Assignment,
    component: Task,
    layout: "/manager",
  },
  {
    path: "/other",
    name: "Khác",
    rtlName: "الرموز",
    icon: MoreHoriz,
    component: OtherButton,
    layout: "/manager",
  },
];

export default managerRoutes;
