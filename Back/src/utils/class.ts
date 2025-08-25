import axios from "axios";
import { dataToQuery } from "./functions";

class _Requester {
  instance;

  constructor(origin: string) {
    this.instance = axios.create({
      baseURL: origin,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async get(url: string, data: any = {}): Promise<any> {
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

  async post(url: string, data: any = {}): Promise<any> {
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
            }
          })
          .finally(() => {
            resolve(result);
          });
      });
    } catch (e) {}
  }

  async delete(url: string, data: any = {}): Promise<any> {
    let instance = this.instance;
    let result = "";
    let params = "?" + new URLSearchParams(data).toString();
    try {
      return new Promise(function (resolve, reject) {
        instance
          .delete(url + params)
          .then((res) => {
            result = res.data;
          })
          .catch((error) => {
            if (error.response) {
              result = error.response.data;
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
}

export const verificationRequester = new _Requester(
  process.env.VERIFICATION_URL || ""
);
