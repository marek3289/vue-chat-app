import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import store from '@/store';
import routes from "./routes";
import { MAIN } from './constants';

const BASE_URL = '/'

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
});

router.beforeEach((routeTo, routeFrom, next) => {
  routeFrom.name !== null && NProgress.start();

  const authRequired = routeTo.matched.some((route) => route.meta.requiresAuth);

  if (!authRequired) return next();

  const restrictedRoutes = ['/logout'].includes(routeTo.fullPath);
  const redirectToLogin = () => next({ name: MAIN.LOGIN.name, query: restrictedRoutes ? {} : { redirectFrom: routeTo.fullPath } });

  if (store.getters.isLoggedIn) {
    // return store.dispatch("validate").then((validUser) => {
    //   validUser ? next() : redirectToLogin();
    // });
    next();
  } else {
    redirectToLogin();
  }
});

router.beforeResolve(async (routeTo: any, routeFrom: any, next: any) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise<void>((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args: any[]) => {
            if (args.length) {
              routeFrom.name === args[0].name && NProgress.done();
              next(...args);
              reject(new Error("Redirected"));
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  } catch (error) {
    return;
  }

  next();
});

router.afterEach(() => NProgress.done());

export default router;
