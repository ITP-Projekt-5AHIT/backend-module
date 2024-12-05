type errorResponseType = {
  message: string;
  statusCode: number;
  status: string;
  name: string;
  stack?: string;
  metaInfo?: string;
};

export default errorResponseType;
