import app from './app';
import config from './config';

const {PORT} = config;

app.listen(PORT, () => console.log(`HTTP Server started on PORT ${PORT}`));
