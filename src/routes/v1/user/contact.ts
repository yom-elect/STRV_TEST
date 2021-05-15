import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../../core/ApiError';
import { RoleCode } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.USER), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.contactCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    // Firebase Save to contact
    const contactCreate = null;
    new SuccessResponse('Contact created successfully', contactCreate).send(res);
  }),
);

export default router;
