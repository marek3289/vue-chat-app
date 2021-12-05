import { RouteRecordRaw, NavigationGuard, NavigationGuardNext } from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import { AuthTypes } from '@/utils/types';
import { MAIN } from './constants';

const routes: Array<RouteRecordRaw> = [
  {
    path: MAIN.HOME.path,
    name: MAIN.HOME.name,
    component: Home,
    meta: {
      title: MAIN.HOME.title,
      requiresAuth: true,
    },
  },
  {
    path: '/chat/:username',
    name: 'chat',
    component: Home,
    meta: {
      title: MAIN.HOME.title,
      requiresAuth: true,
    },
  },
  {
    path: MAIN.LOGIN.path,
    name: MAIN.LOGIN.name,
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: {
      title: MAIN.LOGIN.title,
      beforeResolve(_routeTo: NavigationGuard, _routeFrom: NavigationGuard, next: NavigationGuardNext) {
        const isLoggedIn = store.getters.isLoggedIn;
        isLoggedIn ? next({ name: "home" }) : next();
      },
    },
  },
  {
    path: MAIN.REGISTER.path,
    name: MAIN.REGISTER.name,
    component: () => import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
    meta: {
      title: MAIN.REGISTER.title,
      beforeResolve(_routeTo: NavigationGuard, _routeFrom: NavigationGuard, next: NavigationGuardNext) {
        const isLoggedIn = store.getters.isLoggedIn;
        isLoggedIn ? next({ name: "home" }) : next();
      },
    },
  },
  {
    path: MAIN.LOGOUT.path,
    name: MAIN.LOGOUT.name,
    component: {
      beforeRouteEnter: (_routeTo, routeFrom, next) => {
        store.dispatch(AuthTypes.LOGOUT);
        const authRequiredOnPrevRoute = routeFrom.matched.some((route) => route.meta.requiresAuth);
        next(authRequiredOnPrevRoute ? { name: MAIN.LOGIN.name } : { ...routeFrom });
      },
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: MAIN.NOT_FOUND.path,
    name: MAIN.NOT_FOUND.name,
    component: () => import(/* webpackChunkName: "_404" */ "@/views/_404.vue"),
    props: true,
    meta: {
      title: MAIN.NOT_FOUND.title,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: MAIN.NOT_FOUND.name,
  },
];

export default routes;
