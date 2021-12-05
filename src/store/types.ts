import { ActionContext } from 'vuex';
import { AuthTypes, IAuthState, IAuthForm, IRegisterForm, IUser } from '@/utils/types';

export type MutationsType<S = IAuthState> = {
  [AuthTypes.REGISTER](state: S, payload: IAuthState): void;
  [AuthTypes.LOGIN](state: S, payload: IAuthState): void;
  [AuthTypes.LOGOUT](state: S): void;
}

export type AugmentedActionContext = {
  commit<K extends keyof MutationsType>(key: K, payload?: Parameters<MutationsType[K]>[1]): ReturnType<MutationsType[K]>;
} & Omit<ActionContext<IAuthState, IAuthState>, "commit">;

export interface Actions {
  [AuthTypes.REGISTER]({ commit }: AugmentedActionContext, payload: IRegisterForm): void;
  [AuthTypes.LOGIN]({ commit }: AugmentedActionContext, payload: IAuthForm): void;
  [AuthTypes.LOGOUT]({ commit }: AugmentedActionContext): void;
}

export type Getters = {
  isLoggedIn(state: IAuthState): boolean;
  getCurrentUser(state: IAuthState): IUser | {};
};
