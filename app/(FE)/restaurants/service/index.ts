import { createService } from '~/core/utils';

import { RestaurantEntity } from '../types';

export const restaurantsService = createService<RestaurantEntity>({
  path: '/restaurants',
});
