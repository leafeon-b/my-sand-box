import useSWR, { Fetcher } from "swr";

export const useWords = () => {
  const fetcher: Fetcher<{ data: string[] }, string> = (...args) =>
    fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/words", fetcher);
  const words = data?.data;
  return { words, error };
};
