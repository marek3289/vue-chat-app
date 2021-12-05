import { Request, Response } from 'express';
import createError from 'http-errors';

import { userStore } from '../server';

const getUser = (req: Request, res: Response) => {
  const user = userStore.findAllUsers().find(u => u.username === req.params.username);
  if (!user) throw createError(404, `User with that ID doesn't exist`);

  res.status(200).json({
    status: 'sucess',
    data: {
      user
    }
  });
};


export default { getUser };
