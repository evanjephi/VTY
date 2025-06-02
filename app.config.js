import 'dotenv/config';

export default {
  expo: {
    name: "VTY",
    slug: "VTY",
    scheme: "vty",
    extra: {
      TWELVE_DATA_API_KEY: process.env.EXPO_PUBLIC_TWELVE_DATA_API_KEY,
    },
  },
};
