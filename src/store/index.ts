import { createStore, MutationTree, ActionTree, GetterTree } from 'vuex';
import { getCurrentUser, signUpAction, signInAction, signOutAction } from '@/services/auth';
import { AuthTypes, IAuthState } from '@/utils/types';
import { MutationsType, Actions, Getters } from './types';

const defaultState: IAuthState = {
  accessToken: '',
  refreshToken: '',
  user: {},
}

const state: IAuthState = getCurrentUser() || defaultState;

const mutations: MutationTree<IAuthState> & MutationsType = {
  [AuthTypes.REGISTER]: (state: IAuthState, { accessToken, refreshToken, user }: IAuthState) => {
    state.accessToken = accessToken,
    state.refreshToken = refreshToken,
    state.user = user
  },
  [AuthTypes.LOGIN]: (state: IAuthState, { accessToken, refreshToken, user }: IAuthState) => {
    state.accessToken = accessToken,
    state.refreshToken = refreshToken,
    state.user = user
  },
  [AuthTypes.LOGOUT]: (state: IAuthState) => {
    state.accessToken = ''
    state.refreshToken = ''
    state.user = {}
  },
}

const actions: ActionTree<IAuthState, IAuthState> & Actions = {
  [AuthTypes.REGISTER]: async ({ commit }, form) => {
    try {
      const user = await signUpAction(form);
      commit(AuthTypes.REGISTER, user);

      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
  [AuthTypes.LOGIN]: async ({ commit }, form) => {
    try {
      const user = await signInAction(form);
      commit(AuthTypes.LOGIN, user);

      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
  [AuthTypes.LOGOUT]: async ({ commit }) => {
    await signOutAction();
    commit(AuthTypes.LOGOUT);
  },
}

const getters: GetterTree<IAuthState, IAuthState> & Getters = {
  isLoggedIn: (state: IAuthState) => !!state.accessToken,
  getCurrentUser: (state: IAuthState) => state.user,
}

export default createStore({ state, getters, actions, mutations })
