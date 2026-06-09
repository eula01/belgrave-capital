export const DISCLAIMER_TEXT =
  "This material is provided for informational purposes only and is directed exclusively at authorised clients of Belgrave Capital LTD. It does not constitute investment advice, a personal recommendation, or an offer or solicitation to buy or sell any security or financial instrument. Past performance is not indicative of future results. All investments involve risk, including loss of principal. Belgrave Capital LTD makes no representation or warranty as to the accuracy, completeness, or timeliness of the information contained herein. Recipients should conduct their own independent analysis before making any investment decision.";

export default function Disclaimer({ className = "disclaimer" }: { className?: string }) {
  return <p className={className}>{DISCLAIMER_TEXT}</p>;
}
