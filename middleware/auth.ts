import jwt from 'jsonwebtoken';
import config from '../config';

const { JWT_SECRET } = config;

export default (req: any, res: any, next: any) => {
    const token = req.header('x-auth-token');
    console.log(token);

    if (!token)
        return res.status(401).json({ msg: 'No token, authorizaton denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.body.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};