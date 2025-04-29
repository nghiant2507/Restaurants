import { useSearchParams } from 'next/navigation';

export const UseQueryParams = (values?: Record<string, string>) => {
  const searchParams = useSearchParams();
  let data: Record<string, any>;  //eslint-disable-line

  if (values) {
    data = {
      ...values,
    };
  } else {
    data = {
      ...Object.fromEntries(searchParams),
    };
  }
  const { search, page, limit } = data;

  const queryParams = {
    page: page ?? 1,
    search: search ?? '',
    limit: limit ?? 20,
  };
  return { searchParams, queryParams };
};
