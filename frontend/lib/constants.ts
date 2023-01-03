export const FIVE_SECONDS_MS = 5 * 1000;
export const ONE_MINUTES_MS = 60 * 1000;
export const FIVE_MINUTES_MS = 5 * 60 * 1000;
export const ONE_HOUR_MS = 60 * 60 * 1000;
export const ONE_WEEK_SEC = 7 * 24 * 60 * 60;
export const ONE_WEEK_NS = BigInt(ONE_WEEK_SEC * 1e9);

export const MINT_CYCLES_MEMO = 1347768404;

export const MAX_CHUNK_SIZE = 1024 * 500; // 500kb for file upload in storage canister

export const LEDGER_E8S = 100000000; //ICP
export const LEDGER_FEE = 10000; //ICP Transaction Fee
export const LEDGER_E6S = 1000000; //ICET


//canisterids
export const CANISTER_ONEBLOCK = "nzxho-uqaaa-aaaak-adwxq-cai";
export const CANISTER_ESCROW = "oslfo-7iaaa-aaaag-qakra-cai";

export const IDENTITY_PROVIDER = "https://identity.ic0.app";

//paging
export const PAGING_LENGTH = 10;

export const ORDER_DEFAULT_EXPIRED_DAYS = 5;

export const MENU_HOME = "home";
export const MENU_ORDERS = "orders";
export const MENU_PROFILE = "profile";

export const ORDER_STATUS_NEW = "new";
export const ORDER_STATUS_DEPOSITED = "deposited";
export const ORDER_STATUS_DELIVERED = "delivered";
export const ORDER_STATUS_RECEIVED = "received";
export const ORDER_STATUS_RELEASED = "released";
export const ORDER_STATUS_REFUNDED = "refunded";
export const ORDER_STATUS_CLOSED = "closed";
export const ORDER_STATUS_CANCELED = "canceled";

export const LISTITEM_STATUS_LIST = "list";
export const LISTITEM_STATUS_PENDING = "pending";
export const LISTITEM_STATUS_SOLD = "sold";
export const LISTITEM_STATUS_UNLIST = "unlist";

export const CURRENCY_ICP = "ICP";
export const CURRENCY_ICET = "ICET";

