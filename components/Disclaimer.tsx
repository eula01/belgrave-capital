export const DISCLAIMER_TEXT =
  "this material is provided for informational purposes only and is directed exclusively at authorised clients of belgrave capital ltd. it does not constitute investment advice, a personal recommendation, or an offer or solicitation to buy or sell any security or financial instrument. past performance is not indicative of future results. all investments involve risk, including loss of principal. belgrave capital ltd makes no representation or warranty as to the accuracy, completeness, or timeliness of the information contained herein. recipients should conduct their own independent analysis before making any investment decision.";

export default function Disclaimer({ className = "disclaimer" }: { className?: string }) {
  return <p className={className}>{DISCLAIMER_TEXT}</p>;
}
