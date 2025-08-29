"use server";
<<<<<<< HEAD

=======
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
import Joi from "joi";
import axios from "axios";

const foodSearchSchema = Joi.object({
  upc: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/),
});

export async function foodSearch(formState, formData) {
  const value = foodSearchSchema.validate({
    upc: formData.get("upc"),
  });

  if (value.error) {
    return { results: { _form: ["Must be 12 digits"] } };
  } else {
    const search = formData.get("upc");

    try {
      const response = await axios(
        `https://api.edamam.com/api/food-database/v2/parser?app_id=cd2130a5&app_key=ca65ba68ddafb742a94c488a4bfd3285&upc=${search}&nutrition-type=cooking`
      );

      return { results: response.data.hints[0].food };
    } catch (error) {
      console.log(error);
      return {
        results: {
          _error: ["Not Found (double check the upc code) or not in database"],
        },
      };
    }
  }
}
