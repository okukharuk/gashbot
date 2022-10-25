import axios from 'axios';

import Place from '../models/place';
import Product from '../models/product';
import User from '../models/user';
import { collections } from '../services/db.service';

export const getUsers = async () => {
  return await axios.get("http://localhost:8080/users");
};

export const getUser = async (id: number) => {
  return await axios.get("http://localhost:8080/users/" + id, {
    timeout: 1000,
  });
};

export const updateUser = async (newUser: User, id: number) => {
  return await axios.put("http://localhost:8080/users/" + id, newUser);
};

export const deleteUser = async (id: number) => {
  return await axios.delete("http://localhost:8080/users/" + id, {
    timeout: 1000,
  });
};

export const createUser = async (newUser: User) => {
  return await axios.post("http://localhost:8080/users", newUser);
};

export const getProducts = async () => {
  return await axios.get("http://localhost:8080/product");
};

export const getProductsByPlace = async (place: string) => {
  return await axios.get("http://localhost:8080/product/place/" + place, {
    timeout: 1000,
  });
};

export const getProduct = async (name: string) => {
  return await axios.get("http://localhost:8080/product/name/" + name, {
    timeout: 1000,
  });
};

export const updateProduct = async (name: string, newProduct: Product) => {
  return await axios.put("http://localhost:8080/product/" + name, newProduct);
};

export const deleteProduct = async (name: string) => {
  return await axios.delete("http://localhost:8080/product/" + name, {
    timeout: 1000,
  });
};

export const createProduct = async (newProduct: Product) => {
  return await axios.post("http://localhost:8080/product", newProduct);
};

export const getPlaces = async () => {
  return { data: (await collections.place?.find({}).toArray()) as Place[] };
};

export const createPlace = async (newPlace: Place) => {
  const result = await collections.place?.insertOne(newPlace);
  return result ? true : false;
};

export const createInvoice = async (price: number, name: string) => {
  return await axios
    .post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: price,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_description: name,
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAY_API,
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      return res.data.id;
    })
    .catch((err) => {
      return null;
    });
};

export const createInvoicePayment = async (iid: number) => {
  return await axios
    .post(
      "https://api.nowpayments.io/v1/invoice-payment",
      {
        iid: iid,
        pay_currency: "usdttrc20",
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAY_API,
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      return `https://nowpayments.io/payment/?iid=${iid}&paymentId=${res.data.payment_id}`;
    })
    .catch((err) => console.log(err));
};
