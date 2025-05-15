import { createService } from '~/core/utils';

import { UserEntity } from '../types';

export const usersService = createService<UserEntity>({
  path: '/users',
});
