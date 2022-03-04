export type Wallet = {
  publicKey: string;
};

export type Metadata = {
  name: string;
  code: string;
  issuer: string;
  domain: string;
  description: string;
  hash: string;
  cid: string;
  url: string;
};

export type AccountRecord = {
  id: string;
  last_modified_time: string;
  sequence: string;
  home_domain: string;
  sponsor?: string;
  data: {
    [key: string]: string;
  };
};

export type ClaimRecord = {
  id: string;
  last_modified_time: string;
  asset: string;
};

export type Collection<T> = {
  _embedded: {
    records: T[];
  };
};
