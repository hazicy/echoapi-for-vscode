import { ApiDetailsData } from "@/features/requests/types/api";
import { validate } from "jsonschema";
import schemaRule2 from "../../import/utils/postmanSchema/postman_schema2.0";
import schemaRule2_1 from "../../import/utils/postmanSchema/postman_schema2.1";

export const throwResult = (
  status: "error" | "success",
  message: string,
  data: any = "",
) => {
  return {
    status,
    message,
    data,
  };
};

const loadConverters = (() => {
  let pending: Promise<typeof import("echoapi-converter")> | undefined;
  return () => (pending ??= import("echoapi-converter"));
})();

export const exportMethod = {
  apiToSwagger: async (
    data: any,
    version: string,
    language?: "en" | "zh-cn" | "ja" | "zh-hant" | "id",
  ) => {
    try {
      const { ApiToSwagger } = await loadConverters();
      return await new ApiToSwagger().apiToswagger(
        data,
        version as "2.0" | "3.0",
        language,
      );
    } catch (err) {
      return throwResult("error", String(err));
    }
  },
  apiToPostman: async (data: any) => {
    try {
      const { ApipostToPostman } = await loadConverters();
      return await new ApipostToPostman().convert(data);
    } catch (err) {
      return throwResult("error", String(err));
    }
  },
};

export const importMethod = {
  postmanToApipost: async (data: any, project_id: string) => {
    try {
      let valid_2 = validate(data, schemaRule2).valid;
      let valid_2_1 = validate(data, schemaRule2_1).valid;
      if (!valid_2 && !valid_2_1) {
        return throwResult(
          "error",
          "Import Failed: Unsupported file format. Please upload a vaild Postman file or a compatible format",
        );
      }
      const { PostmanToApipost } = await loadConverters();
      return await new PostmanToApipost().convert(data, project_id, {
        source: "vscode",
      });
    } catch (err) {
      return throwResult("error", String(err));
    }
  },
  thunderToApipost: async (data: any, project_id: string) => {
    try {
      const { ThunderToApipost } = await loadConverters();
      return await new ThunderToApipost().convert(data, project_id);
    } catch (err) {
      return throwResult("error", String(err));
    }
  },
  swaggerToApipost: async (
    data: any,
    options: { basePath: boolean; host: boolean } | null,
  ) => {
    try {
      const { SwaggerToApipost } = await loadConverters();
      return await new SwaggerToApipost().convert(data, options);
    } catch (err) {
      return throwResult("error", String(err));
    }
  },
};
