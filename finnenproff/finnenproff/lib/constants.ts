export const STATUSES=["new","reviewing","awaiting_company","assigned","contacted","completed","rejected"] as const;
export const CONSENT_VERSION="2026-11-draft";
export const STATUS_LABEL:Record<string,string>={new:"Received",reviewing:"Being reviewed",awaiting_company:"Sent to a company",assigned:"A company has been selected",contacted:"A company has accepted your request",completed:"Completed",rejected:"We could not match this request"};
