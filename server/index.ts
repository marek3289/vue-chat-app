import initializeServer from './server';
import router from './routes';

const app = initializeServer(router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
