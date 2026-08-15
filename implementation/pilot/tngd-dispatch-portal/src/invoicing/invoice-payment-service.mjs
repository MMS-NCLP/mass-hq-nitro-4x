import{createHash,randomBytes,randomUUID}from"node:crypto";
const freeze=v=>{if(!v||typeof v!=="object"||Object.isFrozen(v))return v;Object.freeze(v);for(const x of Object.values(v))freeze(x);return v;};
const hash=v=>createHash("sha256").update(String(v)).digest("hex");
const money=(v,n)=>{if(!Number.isSafeInteger(v)||v<0)throw new Error(`${n} must be a non-negative integer in cents.`);return v;};
const forbidden=v=>JSON.stringify(v).match(/card(number)?|cvv|cvc|magnetic|track.?data|pan/i);
export class InvoicePaymentService{
 #invoices=new Map();#byKey=new Map();#webhooks=new Map();#tokens=new Map();#history=new Map();#secure;#authorization;#audit;#square;#now;
 constructor({secureAccess,customerAuthorizationService,auditLog,squareGateway,now=()=>new Date()}={}){if(!secureAccess||!customerAuthorizationService||!auditLog||!squareGateway)throw new Error("BP-011 requires security, BP-010 authorization, audit, and Square gateway contracts.");this.#secure=secureAccess;this.#authorization=customerAuthorizationService;this.#audit=auditLog;this.#square=squareGateway;this.#now=now;}
 createDraftAuthorized({sessionToken,tenantId,authorizationRequestId,idempotencyKey,lineItems,taxCents=0,discountCents=0,depositCents=0,adjustments=[] ,diagnosticReportReference,mediaReferences=[]}){const p=this.#permit(sessionToken,tenantId,"jobs.update",`invoice:${authorizationRequestId}:create`);if(!String(idempotencyKey||"").trim()||!Array.isArray(lineItems)||!lineItems.length)throw new Error("Idempotency key and invoice line items are required.");if(forbidden({lineItems,adjustments,mediaReferences}))throw new Error("Prohibited card data must never enter MASS.");const key=`${tenantId}:${idempotencyKey}`;if(this.#byKey.has(key))return this.#invoices.get(this.#byKey.get(key));const handoff=this.#authorization.financialHandoffAuthorized({sessionToken,tenantId,requestId:authorizationRequestId});const normalized=lineItems.map(x=>freeze({id:x.id||randomUUID(),description:String(x.description||x.name||"").trim(),amountCents:money(x.amountCents,"Line amount"),sourceLineItemId:x.sourceLineItemId||null}));if(normalized.some(x=>!x.description))throw new Error("Every line item requires a description.");const subtotal=normalized.reduce((n,x)=>n+x.amountCents,0),tax=money(taxCents,"Ta×øÚÚ$z{-®éÜj×S•ÕT‘ÑU‚—JHÂˆYˆ
Y[š\›Û›Y[š[˜ÛY\Ê	Û˜[Y_OX
JHÂˆ›İÈ™]È\œ›ÜŠZ\ÜÚ[™È[š\›Û›Y[XÛ\˜][Ûˆ	Û˜[Y_X
NÂˆBŸB‚HÂˆ]ØZ]XØÙ\ÜÊ™]ÈT“
‹‹‹Ë™[ˆ‹[\Ü›Y]K\›
KÛÛœİ[Ë‘—ÓÒÊNÂˆ›İÈ™]È\œ›ÜŠH™X[™[ˆš[H]\İ›İ™HÛÛ[Z]YˆŠNÂŸHØ]Ú
\œ›ÜŠHÂˆYˆ
\œ›Ü‹˜ÛÙHOOH‘S“ÑS•ŠHÂˆ›İÈ\œ›ÜÂˆBŸB‚œ›ØÙ\ÜËœİİ]Üš]JØ[›ÛšXØ[”L›İYÚ”LLH™\ÜÚ]ÜH˜[Y][Ûˆ\ÜÙY—ˆŠNÂ