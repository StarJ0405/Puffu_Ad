import axios from "axios";
import { Cookies as ReactCookies } from "react-cookie";
import { Cookies } from "./utils/Data";
import { dataToQuery, getCookieOption } from "./utils/Functions";
const mode = process.env.REACT_APP_MODE;

const origin = mode
  ? process.env["NEXT_PUBLIC_BACK_" + mode.toUpperCase()] ||
    process.env.NEXT_PUBLIC_BACK
  : process.env.NEXT_PUBLIC_BACK;

class _AdminRequester {
  instance;

  constructor() {
    // axios.defaults.withCredentials = true;
    this.instance = axios.create({
      baseURL: `${origin}/admin`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // withCredentials: true,
    });

    this.instance.interceptors.request.use(
      async (config) => {
        let jwt;
        if (typeof window === "undefined") {
          const { cookies } = await import("next/headers");

          const cookieStore = await cookies();
          jwt = cookieStore.get(Cookies.ADMIN_JWT)?.value;
        } else {
          jwt = new ReactCookies().get(Cookies.ADMIN_JWT, getCookieOption());
        }
        if (jwt) config.headers.Authorization = jwt;
        return config;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (
          error.response.status === 401 &&
          error.response.data === "Unauthorized"
        ) {
          const location = window.location;
          let [, lang, ...others] = location.pathname.split("/");
          if (lang === "m") {
            lang += "/" + others[0];
          }
          if (!location.pathname.includes("/login"))
            window.location.href = `${location.origin}/${lang}/login`;
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, data: any) {
    let instance = this.instance;
    let result = "";
    let params = "?" + dataToQuery(data);

    try {
      return new Promise(function (resolve, reject) {
        instance
          .get(url + params)
          // instance.get(url + params)
          .then((res) => {
            result = res.data;
          })
          .catch((error) => {
            if (error.response) {
              result = error.response.data;
              // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
              // if (error.response.status === 401) {
              //   // invalid token
              //   result.code = error.response.status;
              // } else {
              // }
            } else if (error.request) {
              // 요청이 이루어 졌으나 응답을 받지 못했습니다.
              // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
              // Node.js의 http.ClientRequest 인스턴스입니다.
            } else {
              // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
            }
          })
          .finally(() => {
            resolve(result);
          });
      });
    } catch (e) {
      console.log("에러 발생", e);
    }
  }

  async post(url: string, data: any) {
    let instance = this.instance;
    let result = "";
    try {
      return new Promise(function (resolve, reject) {
        instance
          .post(url, JSON.stringify(data))
          .then((res) => {
            result = res.data;
          })
          .catch((error) => {
            if (error.response) {
              result = error.response.data;
              // if (error.response.status === 401) {
              //   // invalid token
              //   result.code = error.response.status;
              // } else {
              // }
            } else if (error.request) {
            } else {
            }
          })
          .finally(() => {
            resolve(result);
          });
      });
    } catch (e) {}
  }

  async delete(url: string, data: any) {
    let instance = this.instance;
    let result = "";
    let params = "?" + new URLSearchParams(data).toString();
    try {
      return new Promise(function (resolve, reject) {
        instance
          .delete(url + params)
          // instance.get(url + params)
          .then((res) => {
            result = res.data;
          })
          .catch((error) => {
            if (error.response) {
              result = error.response.data;
              // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
              // if (error.response.status === 401) {
              //   // invalid token
              //   result.code = error.response.status;
              // } else {
              // }
            } else if (error.request) {
              // 요청이 이루어 졌으나 응답을 받지 못했습니다.
              // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
              // Node.js의 http.ClientRequest 인스턴스입니다.
            } else {
              // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
            }
          })
          .finally(() => {
            resolve(result);
          });
      });
    } catch (e) {}
  }

  async put(url: string, data: any) {
    let instance = this.instance;
    let result = "";
    try {
      return new Promise(function (resolve, reject) {
        instance
          .put(url, JSON.stringify(data))
          .then((res) => {
            result = res.data;
          })
          .catch((error) => {
            if (error.response) {
              result = error.response.data;
              // if (error.response.status === 401) {
              //   // invalid token
              //   result.code = error.response.status;
              // } else {
              // }
            } else if (error.request) {
            } else {
            }
          })
          .finally(() => {
            resolve(result);
          });
      });
    } catch (e) {}
  }
  // 관리자 관련
  async login(data: any, callback?: Function): Promise<string | any> {
    if (callback) callback(await this.post(`/auth`, data));
    else return await this.post(`/auth`, data);
  }
  async getCurrentUser(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me`, data));
    else return await this.get(`/users/me`, data);
  }
  // 회원 관련
  async getUsers(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users`, data));
    else return await this.get(`/users`, data);
  }

  async updateUser(id?: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/${id}`, data));
    else return await this.post(`/users/${id}`, data);
  }

  async deleteUser(id?: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/users/${id}`, data));
    else return await this.delete(`/users/${id}`, data);
  }
  async restoreUser(
    id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.put(`/users/${id}`, data));
    else return await this.put(`/users/${id}`, data);
  }

  // 링크 관련
  async getLinks(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/links`, data));
    else return await this.get(`/links`, data);
  }

  async getLink(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/links/${id}`, data));
    else return await this.get(`/links/${id}`, data);
  }

  // 스토어 관련
  async createStore(data?: StoreDataFrame, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/stores`, data));
    else return await this.post(`/stores`, data);
  }
  async getStores(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/stores`, data));
    else return await this.get(`/stores`, data);
  }
  async updateStore(
    id: string,
    data?: StoreDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/stores/${id}`, data));
    else return await this.post(`/stores/${id}`, data);
  }
  async deleteStore(id: string, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/stores/${id}`, {}));
    else return await this.delete(`/stores/${id}`, {});
  }

  // 스토어 미니배너 관련
  async getStoreMiniBanners(
    id: string,
    params?: any,
    callback?: Function
  ): Promise<any> {
    const p = await this.get(`/stores/${id}/minibanner`, params);
    if (callback) callback(p);
    else return p;
  }

  async addStoreMiniBanner(
    id: string,
    data: {
      name: string;
      link: string;
      thumbnail: { pc: string; mobile: string };
    },
    callback?: Function
  ): Promise<any> {
    const p = await this.post(`/stores/${id}/minibanner`, {
      action: "add",
      data,
    });
    if (callback) callback(p);
    else return p;
  }

  async updateStoreMiniBanner(
    id: string,
    index: number,
    patch: Partial<{
      name: string;
      link: string;
      thumbnail: { pc: string; mobile: string };
    }>,
    callback?: Function
  ): Promise<any> {
    const p = await this.post(`/stores/${id}/minibanner/${index}`, patch);
    if (callback) callback(p);
    else return p;
  }

  async removeStoreMiniBanner(
    id: string,
    index: number,
    callback?: Function
  ): Promise<any> {
    const p = await this.delete(`/stores/${id}/minibanner/${index}`, {});
    if (callback) callback(p);
    else return p;
  }

  async reorderStoreMiniBanners(
    id: string,
    fromIndex: number,
    toIndex: number,
    callback?: Function
  ): Promise<any> {
    const p = await this.post(`/stores/${id}/minibanner`, {
      action: "reorder",
      data: { fromIndex, toIndex },
    });
    if (callback) callback(p);
    else return p;
  }

  async replaceStoreMiniBanners(
    id: string,
    items: Array<{
      name: string;
      link: string;
      thumbnail: { pc: string; mobile: string };
    }>,
    callback?: Function
  ): Promise<any> {
    const p = await this.post(`/admin/stores/${id}/minibanner`, {
      action: "replace",
      data: items,
    });
    if (callback) callback(p);
    else return p;
  }

  // 배송설정
  async createShippingMethod(
    data?: ShippingMethodDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/methods`, data));
    else return await this.post(`/methods`, data);
  }
  async getShippingMethods(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/methods`, data));
    else return await this.get(`/methods`, data);
  }
  async updateShippingMethod(
    id: string,
    data?: ShippingMethodDataFrame,
    callback?: Function
  ) {
    if (callback) callback(await this.post(`/methods/${id}`, data));
    else return await this.post(`/methods/${id}`, data);
  }
  async deleteShippingMethods(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/methods/${id}`, data));
    else return await this.delete(`/methods/${id}`, data);
  }

  // 입점사
  async createBrand(data?: BrandDataFrame, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/brands`, data));
    else return await this.post(`/brands`, data);
  }
  async getBrands(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/brands`, data));
    else return await this.get(`/brands`, data);
  }
  async updateBrand(
    id: string,
    data?: BrandDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/brands/${id}`, data));
    else return await this.post(`/brands/${id}`, data);
  }
  async deleteBrand(id: string, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/brands/${id}`, {}));
    else return await this.delete(`/brands/${id}`, {});
  }
  // 카테고리
  async createCategory(
    data?: CategoryDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/categories`, data));
    else return await this.post(`/categories`, data);
  }
  async getCategories(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/categories`, data));
    else return await this.get(`/categories`, data);
  }
  async getCategory(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/categories/${id}`, data));
    else return await this.get(`/categories/${id}`, data);
  }
  async updateCategory(
    id: string,
    data?: CategoryDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/categories/${id}`, data));
    else return await this.post(`/categories/${id}`, data);
  }
  async deleteCategory(id: string, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/categories/${id}`, {}));
    else return await this.delete(`/categories/${id}`, {});
  }
  // 상품
  async createProduct(
    data?: ProductDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/products`, data));
    else return await this.post(`/products`, data);
  }
  async getProducts(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products`, data));
    else return await this.get(`/products`, data);
  }
  async getProduct(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products/${id}`, data));
    else return await this.get(`/products/${id}`, data);
  }
  async updateProduct(
    id: string,
    data?: ProductDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/products/${id}`, data));
    else return await this.post(`/products/${id}`, data);
  }
  async putProduct(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.put(`/products/${id}`, data));
    else return await this.put(`/products/${id}`, data);
  }

  async deleteProduct(id: string, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/products/${id}`, {}));
    else return await this.delete(`/products/${id}`, {});
  }
  // 옵션
  async createVaraint(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/variants`, data));
    else return await this.post(`/variants`, data);
  }
  async getVariants(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/variants`, data));
    else return await this.get(`/variants`, data);
  }
  async updateVaraint(
    id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/variants/${id}`, data));
    else return await this.post(`/variants/${id}`, data);
  }
  async deleteVaraint(
    id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/variants/${id}`, data));
    else return await this.delete(`/variants/${id}`, data);
  }

  //  옵션 그룹
  async createOption(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/options`, data));
    else return await this.post(`/options`, data);
  }
  async updateOption(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/options/${id}`, data));
    else return await this.post(`/options/${id}`, data);
  }
  async deleteOption(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/options/${id}`, data));
    else return await this.delete(`/options/${id}`, data);
  }

  // 주문서
  async getOrders(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/orders`, data));
    else return await this.get(`/orders`, data);
  }
  async updateOrders(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.put(`/orders`, data));
    else return await this.put(`/orders`, data);
  }
  async updateOrder(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/orders/${id}`, data));
    else return await this.post(`/orders/${id}`, data);
  }
  async cancelOrders(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/orders/cancel`, data));
    else return await this.post(`/orders/cancel`, data);
  }

  async refundOrder(
    order_id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/orders/${order_id}/refund`, data));
    else return await this.post(`/orders/${order_id}/refund`, data);
  }
  async exchangeOrder(
    order_id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback)
      callback(await this.post(`/orders/${order_id}/exchange`, data));
    else return await this.post(`/orders/${order_id}/exchange`, data);
  }
  // 주문서 환불
  async getRefunds(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/refunds`, data));
    else return await this.get(`/refunds`, data);
  }
  async updateRefund(
    refund_id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/refunds/${refund_id}`, data));
    else return await this.post(`/refunds/${refund_id}`, data);
  }
  async completeRefund(
    refund_id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.put(`/refunds/${refund_id}`, data));
    else return await this.put(`/refunds/${refund_id}`, data);
  }
  async cancelRefund(
    refund_id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/refunds/${refund_id}`, data));
    else return await this.delete(`/refunds/${refund_id}`, data);
  }
  // 주문서 교환
  async getExchanges(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/exchanges`, data));
    else return await this.get(`/exchanges`, data);
  }
  async updateExchange(
    exchange_id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/exchanges/${exchange_id}`, data));
    else return await this.post(`/exchanges/${exchange_id}`, data);
  }
  async cancelExchange(
    exchange_id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback)
      callback(await this.delete(`/exchanges/${exchange_id}`, data));
    else return await this.delete(`/exchanges/${exchange_id}`, data);
  }
  // 공지사항
  async createNotices(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/notices`, data));
    else return await this.post(`/notices`, data);
  }
  async getNotices(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/notices`, data));
    else return await this.get(`/notices`, data);
  }
  async updateNotice(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/notices/${id}`, data));
    else return await this.post(`/notices/${id}`, data);
  }
  async deleteNotice(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/notices/${id}`, data));
    else return await this.delete(`/notices/${id}`, data);
  }
  // 배너
  async createBanners(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/banners`, data));
    else return await this.post(`/banners`, data);
  }
  async getBanners(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/banners`, data));
    else return await this.get(`/banners`, data);
  }
  async updateBanner(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/banners/${id}`, data));
    else return await this.post(`/banners/${id}`, data);
  }
  async deleteBanner(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/banners/${id}`, data));
    else return await this.delete(`/banners/${id}`, data);
  }
  // 프로모션
  async createPromotion(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/events`, data));
    else return await this.post(`/events`, data);
  }
  async createPromotionDiscount(
    event_id: string,
    data?: any,
    callback?: Function
  ) {
    if (callback)
      callback(await this.post(`/events/${event_id}/discount`, data));
    else return await this.post(`/events/${event_id}/discount`, data);
  }
  async createPromotionBundle(
    event_id: string,
    data?: any,
    callback?: Function
  ) {
    if (callback) callback(await this.post(`/events/${event_id}/bundle`, data));
    else return await this.post(`/events/${event_id}/bundle`, data);
  }
  async getPromotions(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/events`, data));
    else return await this.get(`/events`, data);
  }
  async getPromotion(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/events/${id}`, data));
    else return await this.get(`/events/${id}`, data);
  }
  async updatePromotion(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/events/${id}`, data));
    else return await this.post(`/events/${id}`, data);
  }
  async updatePromotionDiscount(
    event_id: string,
    discount_id: string,
    data?: any,
    callback?: Function
  ) {
    if (callback)
      callback(
        await this.post(`/events/${event_id}/discount/${discount_id}`, data)
      );
    else
      return await this.post(
        `/events/${event_id}/discount/${discount_id}`,
        data
      );
  }
  async updatePromotionBundle(
    event_id: string,
    bundle_id: string,
    data?: any,
    callback?: Function
  ) {
    if (callback)
      callback(
        await this.post(`/events/${event_id}/bundle/${bundle_id}`, data)
      );
    else
      return await this.post(`/events/${event_id}/bundle/${bundle_id}`, data);
  }
  async deletePromotion(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/events/${id}`, data));
    else return await this.delete(`/events/${id}`, data);
  }
  async deletePromotionDiscount(
    event_id: string,
    discount_id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback)
      callback(
        await this.delete(`/events/${event_id}/discount/${discount_id}`, data)
      );
    else
      return await this.delete(
        `/events/${event_id}/discount/${discount_id}`,
        data
      );
  }
  async deletePromotionBundle(
    event_id: string,
    bundle_id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback)
      callback(
        await this.delete(`/events/${event_id}/bundle/${bundle_id}`, data)
      );
    else
      return await this.delete(`/events/${event_id}/bundle/${bundle_id}`, data);
  }
  // 채팅
  async getMyChatrooms(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get("/users/me/chatrooms", data));
    else return await this.get("/users/me/chatrooms", data);
  }
  // 문의
  async getQAs(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get("/qa", data));
    else return await this.get("/qa", data);
  }
  async answerQA(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/qa/${id}`, data));
    else return await this.post(`/qa/${id}`, data);
  }
  // 멤버쉽
  async createGroup(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post("/groups", data));
    else return await this.post("/groups", data);
  }
  async getGroups(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get("/groups", data));
    else return await this.get("/groups", data);
  }
  async updateGroup(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/groups/${id}`, data));
    else return await this.post(`/groups/${id}`, data);
  }
  async deleteGroup(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/groups/${id}`, data));
    else return await this.delete(`/groups/${id}`, data);
  }
  // 쿠폰
  async createCoupon(
    data?: CouponDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/coupons`, data));
    else return await this.post(`/coupons`, data);
  }
  async getCoupons(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/coupons`, data));
    else return await this.get(`/coupons`, data);
  }
  async updateCoupon(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/coupons/${id}`, data));
    else return await this.post(`/coupons/${id}`, data);
  }
  async deleteCoupon(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/coupons/${id}`, data));
    else return await this.delete(`/coupons/${id}`, data);
  }
  async giveCoupon(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.put(`/coupons/${id}`, data));
    else return await this.put(`/coupons/${id}`, data);
  }
  // 구독
  async createSubscribe(
    data?: SubscribeDataFrame,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/subscribes`, data));
    else return await this.post(`/subscribes`, data);
  }
  async getSubscribe(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/subscribes`, data));
    else return await this.get(`/subscribes`, data);
  }
  async updateSubscribe(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/subscribes/${id}`, data));
    else return await this.post(`/subscribes/${id}`, data);
  }
  async deleteSubscribe(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/subscribes/${id}`, data));
    else return await this.delete(`/subscribes/${id}`, data);
  }
  // 포인트 기록
  async getPointList(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/users/${id}/points`, data));
    else return await this.get(`/users/${id}/points`, data);
  }
  async givePoint(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/${id}/points`, data));
    else return await this.post(`/users/${id}/points`, data);
  }

  // 쿠폰 기록
  async getCouponList(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/users/${id}/coupons`, data));
    else return await this.get(`/users/${id}/coupons`, data);
  }
  // 구독 기록
  async getSubscribeList(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/users/${id}/subscribes`, data));
    else return await this.get(`/users/${id}/subscribes`, data);
  }
  async refundSubscribe(
    user_id: string,
    subscribe_id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback)
      callback(
        await this.delete(`/users/${user_id}/subscribes/${subscribe_id}`, data)
      );
    else
      return await this.delete(
        `/users/${user_id}/subscribes/${subscribe_id}`,
        data
      );
  }
  // 리뷰
  async getReviews(data?: any, callback?: Function) {
    if (callback) callback(await this.get(`/reviews`, data));
    else return await this.get(`/reviews`, data);
  }
  async updateReviews(id: string, data?: any, callback?: Function) {
    if (callback) callback(await this.post(`/reviews/${id}`, data));
    else return await this.post(`/reviews/${id}`, data);
  }

  // 전자문서(e-contract) 관련
  // ──────────────────────────────────────────────

  // 계약 목록 조회
  async getContracts(data?: any, callback?: Function) {
    if (callback) callback(await this.get(`/users/me/contract`, data));
    else return await this.get(`/users/me/contract`, data);
  }

  // 계약 상세조회
  async getContract(id: string, data?: any, callback?: Function) {
    if (callback) callback(await this.get(`/users/me/contract/${id}`, data));
    else return await this.get(`/users/me/contract/${id}`, data);
  }

  // 계약 생성 (템플릿 복제 기반)
  async createContract(origin_id: string, data?: any, callback?: Function) {
    if (callback)
      callback(await this.post(`/users/me/contract/${origin_id}/create`, data));
    else return await this.post(`/users/me/contract/${origin_id}/create`, data);
  }

  // 계약 수정 (페이지, 입력필드 포함)
  async updateContract(id: string, data?: any, callback?: Function) {
    if (callback) callback(await this.post(`/users/me/contract/${id}`, data));
    else return await this.post(`/users/me/contract/${id}`, data);
  }

  // 계약 삭제
  async deleteContract(id: string, callback?: Function) {
    if (callback) callback(await this.delete(`/users/me/contract/${id}`, {}));
    else return await this.delete(`/users/me/contract/${id}`, {});
  }

  // 계약 완료 처리
  async completeContract(id: string, callback?: Function) {
    if (callback)
      callback(await this.post(`/users/me/contract/${id}/complete`, {}));
    else return await this.post(`/users/me/contract/${id}/complete`, {});
  }

  // 템플릿 생성
  async createTemplate(data?: any, callback?: Function) {
    if (callback)
      callback(await this.post(`/users/me/contract/template`, data));
    else return await this.post(`/users/me/contract/template`, data);
  }

  // 동일 템플릿 기반 계약 목록 조회
  async getContractVersions(
    origin_id: string,
    data?: any,
    callback?: Function
  ) {
    if (callback)
      callback(
        await this.get(`/users/me/contract/${origin_id}/versions`, data)
      );
    else
      return await this.get(`/users/me/contract/${origin_id}/versions`, data);
  }

  // 참여자 상태 변경 (ready / confirm)
  async updateContractUserStatus(
    contract_user_id: string,
    user_id: string,
    data: { status: string },
    callback?: Function
  ) {
    if (callback)
      callback(
        await this.post(`/users/me/contract_user/${contract_user_id}/status`, {
          user_id,
          ...data,
        })
      );
    else
      return await this.post(
        `/users/me/contract_user/${contract_user_id}/status`,
        { user_id, ...data }
      );
  }
}

export default _AdminRequester;

let adminRequester: _AdminRequester;

if (process.env.NEXT_PUBLIC_DEV) {
  adminRequester = new _AdminRequester();
} else {
  if (typeof window === "undefined") {
    // 서버 사이드 (Node.js) 개발 모드에서 HMR로 인해 여러 인스턴스가 생성되는 것을 방지
    if (!(global as any).adminRequesterInstance) {
      (global as any).adminRequesterInstance = new _AdminRequester();
    }
    adminRequester = (global as any).adminRequesterInstance;
  } else {
    // 클라이언트 사이드 (브라우저)
    if (!(window as any).adminRequesterInstance) {
      (window as any).adminRequesterInstance = new _AdminRequester();
    }
    adminRequester = (window as any).adminRequesterInstance;
  }
}

export { adminRequester };
