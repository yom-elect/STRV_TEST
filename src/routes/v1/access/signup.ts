import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import User from '../../../database/model/User';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import argon2 from 'argon2';
import _ from 'lodash';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await argon2.hash(req.body.password);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        email: req.body.email,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.USER,
    );

    const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
    new SuccessResponse('Signup Successful', {
      user: _.pick(createdUser, ['_id', 'email', 'roles']),
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
