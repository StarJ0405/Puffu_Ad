import axios from "axios";
import { Cookies as ReactCookies } from "react-cookie";
import { Cookies } from "./utils/Data";
import { dataToQuery, getCookieOption } from "./utils/Functions";
const mode = process.env.REACT_APP_MODE;

const origin = mode
  ? process.env["NEXT_PUBLIC_BACK_" + mode.toUpperCase()] ||
    process.env.NEXT_PUBLIC_BACK
  : process.env.NEXT_PUBLIC_BACK;

class _Requester {
  instance;

  constructor() {
    // axios.defaults.withCredentials = true;
    this.instance = axios.create({
      baseURL: `${origin}`,
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
          jwt = cookieStore.get(Cookies.JWT)?.value;
        } else {
          jwt = new ReactCookies().get(Cookies.JWT, getCookieOption());
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

  // 회원 관련
  async loginOuathLogin(
    type: string,
    data: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/auth/oauth/${type}`, data));
    else return await this.post(`/auth/oauth/${type}`, data);
  }
  async getOuathLogin(
    type: string,
    data: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/auth/oauth/${type}`, data));
    else return await this.get(`/auth/oauth/${type}`, data);
  }

  async createOuathLink(
    type: string,
    data: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/users/me/oauth/${type}`, data));
    else return await this.post(`/users/me/oauth/${type}`, data);
  }
  async getOuathLink(
    type: string,
    data: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/users/me/oauth/${type}`, data));
    else return await this.get(`/users/me/oauth/${type}`, data);
  }
  async deleteOuathLink(
    type: string,
    data: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/oauth/${type}`, data));
    else return await this.delete(`/users/me/oauth/${type}`, data);
  }

  async isConnectExist(data: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/connect/exist`, data));
    else return await this.get(`/connect/exist`, data);
  }
  async userConnect(data: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/connect`, data));
    else return await this.post(`/users/me/connect`, data);
  }

  async createUser(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users`, data));
    else return await this.post(`/users`, data);
  }

  async login(data: any, callback?: Function): Promise<string | any> {
    if (callback) callback(await this.post(`/auth`, data));
    else return await this.post(`/auth`, data);
  }
  async getCurrentUser(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me`, data));
    else return await this.get(`/users/me`, data);
  }
  async deleteUser(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/users/me`, data));
    else return await this.delete(`/users/me`, data);
  }

  async getToken(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/verification`, data));
    else return await this.get(`/verification`, data);
  }
  async verification(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/verification`, data));
    else return await this.post(`/verification`, data);
  }
  async verificationCheck(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/verification/check`, data));
    else return await this.post(`/verification/check`, data);
  }
  async sendEmail(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/verification/email`, data));
    else return await this.post(`/verification/email`, data);
  }
  async isExistUser(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/auth`, data));
    else return await this.get(`/auth`, data);
  }
  async changePassword(
    email?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/users/${email}`, data));
    else return await this.post(`/users/${email}`, data);
  }
  // 비밀번호 확인: POST /users/me  (body: { password })
  async checkCurrentPassword(
    data: { password: string },
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/users/me`, data));
    else return await this.post(`/users/me`, data);
  }
  async updateCurrentUser(
    data: {
      password?: string;
      thumbnail?: string;
    },
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.put(`/users/me`, data));
    else return await this.put(`/users/me`, data);
  }

  // 포인트 관련
  async checkLink(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/links`, data));
    else return await this.post(`/users/me/links`, data);
  }

  // 스토어 관련
  async getStores(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/stores`, data));
    else return await this.get(`/stores`, data);
  }
  // 카테고리 관련
  async getCategories(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/categories`, data));
    else return await this.get(`/categories`, data);
  }
  async getCategory(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/categories/${id}`, data));
    else return await this.get(`/categories/${id}`, data);
  }
  // 상품 관련
  async getProducts(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products`, data));
    else return await this.get(`/products`, data);
  }
  async getProduct(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products/${id}`, data));
    else return await this.get(`/products/${id}`, data);
  }
  async getProductReviews(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/products/${id}/reviews`, data));
    else return await this.get(`/products/${id}/reviews`, data);
  }

  async getProductQA(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.get(`/products/${id}/qa`, data));
    else return await this.get(`/products/${id}/qa`, data);
  }
  // 최근 본 상품
  async addRecent(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/recent`, data));
    else return await this.post(`/users/me/recent`, data);
  }
  // 배송지 관련 주소
  async createAddress(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/address`, data));
    else return await this.post(`/users/me/address`, data);
  }
  async getAddresses(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/address`, data));
    else return await this.get(`/users/me/address`, data);
  }
  async updateAddresses(
    id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/users/me/address/${id}`, data));
    else return await this.post(`/users/me/address/${id}`, data);
  }
  async deleteAddresses(
    id?: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/address/${id}`, data));
    else return await this.delete(`/users/me/address/${id}`, data);
  }
  // 배송지 관련 주소 끝
  // 카트 관련
  async addItem(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/cart/items`, data));
    else return await this.post(`/users/me/cart/items`, data);
  }
  async updateItem(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.put(`/users/me/cart/items`, data));
    else return await this.put(`/users/me/cart/items`, data);
  }
  async removeItem(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/cart/items`, data));
    else return await this.delete(`/users/me/cart/items`, data);
  }
  async changeItem(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/cart/items/${id}`, data));
    else return await this.post(`/users/me/cart/items/${id}`, data);
  }
  async getMyCart(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/cart`, data));
    else return await this.get(`/users/me/cart`, data);
  }
  // 주문서 관련
  async createOrder(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/cart/complete`, data));
    else return await this.post(`/users/me/cart/complete`, data);
  }
  async getOrders(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/order`, data));
    else return await this.get(`/users/me/order`, data);
  }
  async getOrderStatus(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/order/status`, data));
    else return await this.get(`/users/me/order/status`, data);
  }
  async cancelOrder(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/order/${id}`, data));
    else return await this.delete(`/users/me/order/${id}`, data);
  }

  // 키워드 관련
  async addKeyword(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/keywords`, data));
    else return await this.post(`/users/me/keywords`, data);
  }
  async getKeywords(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/keywords`, data));
    else return await this.get(`/keywords`, data);
  }
  // 배너 관련
  async getBanners(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/banners`, data));
    else return await this.get(`/banners`, data);
  }
  // 좋아요 관련
  async createWishList(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/wishlist`, data));
    else return await this.post(`/users/me/wishlist`, data);
  }
  async getWishlists(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/wishlist`, data));
    else return await this.get(`/users/me/wishlist`, data);
  }
  async deleteWishList(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/wishlist/${id}`, data));
    else return await this.delete(`/users/me/wishlist/${id}`, data);
  }
  // 공지사항 관련
  async getNotices(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/notices`, data));
    else return await this.get(`/notices`, data);
  }
  async getNoticeTypes(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/notices/types`, data));
    else return await this.get(`/notices/types`, data);
  }
  // Q&A, 1:1문의
  async createQA(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/qa`, data));
    else return await this.post(`/users/me/qa`, data);
  }
  async getQAs(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/qa`, data));
    else return await this.get(`/users/me/qa`, data);
  }
  async updateQA(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/qa/${id}`, data));
    else return await this.post(`/users/me/qa/${id}`, data);
  }
  async deleteQA(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/qa/${id}`, data));
    else return await this.delete(`/users/me/qa/${id}`, data);
  }
  // 리뷰
  async createReview(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/users/me/reviews`, data));
    else return await this.post(`/users/me/review`, data);
  }
  async getReviews(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/reviews`, data));
    else return await this.get(`/users/me/review`, data);
  }
  async updateReviews(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.post(`/users/me/review/${id}`, data));
    else return await this.post(`/users/me/review/${id}`, data);
  }
  async deleteReview(
    id: string,
    data?: any,
    callback?: Function
  ): Promise<any> {
    if (callback) callback(await this.delete(`/users/me/review/${id}`, data));
    else return await this.delete(`/users/me/review/${id}`, data);
  }
  // 포인트 사용 내역
  async getPoints(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/points`, data));
    else return await this.get(`/users/me/point`, data);
  }
  // 채팅 관련
  async getChatroom(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/users/me/chatroom`, data));
    else return await this.get(`/users/me/chatrooms`, data);
  }
  async getChats(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback)
      callback(await this.get(`/users/me/chatrooms/${id}/chats`, data));
    else return await this.get(`/users/me/chatrooms/${id}/chats`, data);
  }
  // 토스 관련
  async tossSuccess(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.post(`/payment`, data));
    else return await this.post(`/payment`, data);
  }

  // nestpay 관련
  // 요청
  async requestPaymentApproval(data: any): Promise<any> {
    try {
      const response = await this.post("/payment/nestpay/ready", data);
      return response;
    } catch (error) {
      console.error("Payment approval error:", error);
      throw error;
    }
  }
  // 응답
  async approvePayment(data: any): Promise<any> {
    try {
      const response = await this.post("/payment/nestpay/approve", data);
      return response;
    } catch (error) {
      console.error("Payment approval error:", error);
      throw error;
    }
  }
}

export default _Requester;

let requester: _Requester;

if (process.env.NEXT_PUBLIC_DEV) {
  requester = new _Requester();
} else {
  if (typeof window === "undefined") {
    // 서버 사이드 (Node.js) 개발 모드에서 HMR로 인해 여러 인스턴스가 생성되는 것을 방지
    if (!(global as any).requesterInstance) {
      (global as any).requesterInstance = new _Requester();
    }
    requester = (global as any).requesterInstance;
  } else {
    // 클라이언트 사이드 (브라우저)
    if (!(window as any).requesterInstance) {
      (window as any).requesterInstance = new _Requester();
    }
    requester = (window as any).requesterInstance;
  }
}

export { requester };
