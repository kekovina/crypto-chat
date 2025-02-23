import { NextConfig } from "next";
import Joi from 'joi';
import path from 'node:path'
import { writeFileSync } from 'node:fs';

const configuration = {
  NEXT_PUBLIC_DOMAIN: process.env.DOMAIN
};

const configurationValidation = Joi.object({
  DOMAIN: Joi.string().description('домен приложения').default("localhost")
});

const sampleEnvDocumentation = () => {
  const joiModel = configurationValidation.describe();
  let output = '';
  Object.keys(joiModel.keys).forEach((key) => {
    const keyObject = joiModel.keys[key];
    const description = keyObject?.flags?.description;
    const finalDescription = description ? `# ${description}\n` : '';

    let value = `<${key}>`;
    if (keyObject?.flags?.default) {
      value = keyObject.flags.default;
    }
    if (keyObject?.allow) {
      value = `<${keyObject.allow.join(' | ')}>`;
    }

    output += `${finalDescription}${key}=${value}\n`;
  });
  writeFileSync(
    path.join(process.cwd(), '.env.example'),
    output,
  );
};
sampleEnvDocumentation();

const validationResult = configurationValidation.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
});

const errorDetails = validationResult?.error?.details;
if (errorDetails?.length) {
  let finalError = '';
  errorDetails.forEach((item) => {
    finalError += `${item.message}\n`;
  });
  throw new Error(finalError);
}

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: configuration,

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: `https://${process.env.DOMAIN}` },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
export default nextConfig;

