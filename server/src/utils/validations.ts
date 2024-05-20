import { object, string } from "yup";
import { regex } from "./regexp";

const userValidation = () => {
  return object()
    .shape({
      name: string().required(),
      username: string().required(),
      password: string().required(),
      phone: string().required(),
      email: string().email().required(),
      website: string().matches(regex.website).required(),
      address: object({
        street: string().required(),
        suite: string().required(),
        city: string().required(),
        zipcode: string().required(),
        geo: object({
          lat: string().required(),
          lng: string().required(),
        }).required(),
      }).required(),
      company: object({
        name: string().required(),
        catchPhrase: string().required(),
        bs: string().required(),
      }),
    })
    .default(undefined) // 👈
    .required();
};

export const validation = {
  userValidation,
};
