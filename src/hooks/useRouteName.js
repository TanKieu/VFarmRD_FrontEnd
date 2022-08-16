import routes from "routes";
import mnroutes from "mnroutes";
import stroutes from "stroutes";

export const useRouteName = () => {
  let name = "";
  routes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = routes.rtlActive ? route.rtlName : route.name;
    }
  });
  mnroutes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = mnroutes.rtlActive ? route.rtlName : route.name;
    }
  });
  stroutes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = stroutes.rtlActive ? route.rtlName : route.name;
    }
  });
  return name;
};
