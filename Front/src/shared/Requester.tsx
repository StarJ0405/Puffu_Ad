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
  // 상품 관련
  async getProducts(data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products`, data));
    else return await this.get(`/products`, data);
  }
  async getProduct(id: string, data?: any, callback?: Function): Promise<any> {
    if (callback) callback(await this.get(`/products/${id}`, data));
    else return await this.get(`/products/${id}`, data);
  }
  // 배송지 관련
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
