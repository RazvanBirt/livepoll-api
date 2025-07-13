// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction, RequestHandler } from 'express';


// const SECRET = process.env.JWT_SECRET ?? '';

// const authMiddleware: RequestHandler = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader?.split(' ')[1];

//     if (!token) {
//         res.status(401).json({ error: 'No token provided' });
//         return;
//     }

//     try {
//         const decoded = jwt.verify(token, SECRET);
//         (req as any).user = decoded;
//         next();
//     } catch (err) {
//         console.error('JWT verification error:', err);
//         res.status(403).json({ error: 'Invalid token' });
//         return;
//     }
// };

// export default authMiddleware;


import { RequestHandler } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { JwtPayload } from 'jsonwebtoken';

const authMiddleware: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    try {
        const decoded = verifyToken(token) as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(403).json({ error: 'Invalid token' });
        return;
    }
};

export default authMiddleware;
