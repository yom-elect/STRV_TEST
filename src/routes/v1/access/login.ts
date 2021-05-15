import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import argon2 from 'argon2';
import _ from 'lodash';

const router = express.Router();

export default router.post(
  '/basic',
  validator(schema.userCredential),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');

    const match = await argon2.verify(req.body.password, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    new SuccessResponse('Login Success', {
      user: _.pick(user, ['_id', 'roles']),
      tokens: tokens,
    }).send(res);
  }),
);
