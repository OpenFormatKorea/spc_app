/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { GetServerSidePropsContext } from "next";

import { AxiosResponse } from "axios";
import { getAxiosInstanceServer } from "@/lib/axios";

/**
 * @param {string} relative_url Relative URL
 * @param {object} data Token
 * @returns {object} Response object
 */

export type fetchAPIType = (
  context: GetServerSidePropsContext,
  relative_url: string,
  method: string,
  data: { [key: string]: any },
  params?: { [key: string]: any }
) => Promise<AxiosResponse["data"]>;

export const fetchAPI: fetchAPIType = async (context, relative_url, method = "GET", data, params = {}) => {
  const api = await getAxiosInstanceServer(context);

  if (!api) return;
  const res = await api({
    method,
    url: relative_url,
    data,
    params,
  });
  return res.data;
};
