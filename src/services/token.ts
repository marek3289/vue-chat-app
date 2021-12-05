const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem('user') as any);

  return user?.refreshToken;
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('user') as any);

  return user?.accessToken;
};

const updateLocalAccessToken = (token: any) => {
  const user = JSON.parse(localStorage.getItem('user') as any);
  user.accessToken = token;
  localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => JSON.parse(localStorage.getItem('user') as any);

const setUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const removeUser = () => localStorage.removeItem('user');

export default { getLocalRefreshToken, getLocalAccessToken, updateLocalAccessToken, getUser, setUser, removeUser };
