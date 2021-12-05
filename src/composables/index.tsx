import { useEffect } from 'react';
import socket from 'socket';

const App: React.FC = () => {
  useEffect(() => {
    const { user } = getCurrentUser();
    const { username, userID } = user;

    socket.userID = userID;
    socket.username = username;
    socket.connect();

    socket.on('connect_error', err => signOut());

    return () => socket.off('connect_error');
  }, []);

  return <Child />
};

export default App;
