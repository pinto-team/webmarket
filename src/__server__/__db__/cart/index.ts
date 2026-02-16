// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com

import MockAdapter from "axios-mock-adapter";
import data from "./data";

export const CartEndpoints = (Mock: MockAdapter) => {
  Mock.onGet("/cart-items").reply(async () => {
    try {
      return [200, data];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  Mock.onPost("/cart-items").reply(async () => {
    try {
      return [200, data];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  Mock.onPut(/\/cart-items\/\d+/).reply(async () => {
    try {
      return [200, data];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  Mock.onDelete(/\/cart-items\/\d+/).reply(async () => {
    try {
      return [200, { success: true }];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });
};
