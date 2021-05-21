import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { RoleCode } from '../../../database/model/Role';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import admin from '../../../helpers/firebaseAdmin';

const router = express.Router();
const db = admin.firestore();
const contact = db.collection('addressBook');

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.USER), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.contactCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const { firstName, lastName, address, phoneNumber } = req.body;
    let docRef = contact.doc(firstName);
    await docRef.set({
      lastName,
      phoneNumber,
      address,
      firstName,
    });
    new SuccessResponse('Contact created successfully', true).send(res);
  }),
);

export default router;
