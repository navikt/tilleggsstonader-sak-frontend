import { Request, Response } from 'express';

export const redirectResponseToLogin = (req: Request, res: Response) =>
    res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
