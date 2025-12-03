"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { Sessions } from "@/shared/utils/Data";
import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

export default function TossPaymentPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [data, setData] = useState<any>();
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [agree, setAgree] = useState(true);
  const [total, setTotal] = useState(0);
  const { cartData } = useCart();
  const { storeData } = useStore();
  const clientKey = process.env.NEXT_PUBLIC_CLIENTKEY as string;
  const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL as string;

  useEffect(() => {
    if (!userData?.id) return navigate(`/auth/login?redirect_url=/orders/cart`);

    const init = async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const customerKey = String(userData?.id);
        const paymentWidgets = tossPayments.widgets({
          customerKey,
          brandpay: { redirectUrl },
        });
        setWidgets(paymentWidgets);
      } catch (err) {
        // setError("결제 위젯을 불러오는 중 오류가 발생했습니다.");
      }
    };
    const item = sessionStorage.getItem(Sessions.PAYMENT);
    if (!item) return navigate("/orders/cart");
    const data = JSON.parse(item);
    if (!data) return navigate("/orders/cart");
    setData(data);
    setTimeout(() => {
      sessionStorage.removeItem(Sessions.PAYMENT);
    }, 100);

    let totalTax = 0;
    let totalDiscounted = 0;
    const selected = data?.selected || [];
    const items = cartData?.items.filter((item) => selected.includes(item.id));
    items?.forEach((item) => {
      const discount_price = item?.variant?.discount_price || 0;
      const tax = Math.round(
        (discount_price * (item?.variant?.product?.tax_rate || 0)) / 100
      );
      totalDiscounted += discount_price * item.quantity;
      totalTax += tax * item.quantity;
    });

    const method = storeData?.methods?.find(
      (f) => f.id === data.shipping_method_id
    );

    setTotal(totalDiscounted + totalTax + (method?.amount || 0));
    init();
  }, [userData?.id]);

  useEffect(() => {
    if (!widgets) return;
    const render = async () => {
      await widgets.setAmount({ currency: "KRW", value: total });

      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "brand_puffu",
      });
      const agreementWidget = await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      agreementWidget.on("agreementStatusChange", (status: any) => {
        const allRequiredAgreed =
          !!status?.requiredTermsAgreed ||
          !!status?.agreedRequiredTerms ||
          !!status?.agreed;
        setAgree(allRequiredAgreed);
      });

      // 약관 제거
      // agreementWidget.destroy();

      setReady(true);
    };
    render();
  }, [widgets]);

  const handlePaymentRequest = async () => {
    if (!widgets || !ready || !data) return;
    try {
      const selected = data?.selected || [];
      const items = cartData?.items.filter((item) =>
        selected.includes(item.id)
      );

      const orderId =
        String(data?.cart_id) + "_" + String(new Date().getTime());
      const orderName =
        items && items?.length > 0
          ? items?.length > 1
            ? `${items[0]?.variant.total_code} 외 ${items?.length - 1}건`
            : `${items?.[0]?.variant?.total_code || "주문"}`
          : "주문";

      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/orders/cart/toss/success`,
        failUrl: `${window.location.origin}/orders/cart/toss/fail`,
        customerEmail: userData?.username,
        customerName: userData?.name,
        metadata: { json: JSON.stringify(data) },
      });
    } catch (err) {
      // toast({
      //   type: "error",
      //   message: `[${err.code || "오류"}] ${err.message || "결제 중 오류가 발생했습니다."}`,
      // });
      console.error(err);
    }
  };
  return (
    <VerticalFlex padding={"180px 0 0"} margin={"0 auto"}>
      <div id="payment-method" />
      <div id="agreement" />
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "9px 15px",
        }}
      >
        <Button
          disabled={!ready || !agree}
          width={"100%"}
          height={46}
          // backgroundColor={ready ? "var(--main-color)" : "#EEEEEE"}
          // borderRadius={3}
          onClick={handlePaymentRequest}
          borderRadius={4}
        >
          <P
            size={18}
            weight={600}
            color={ready ? "white" : "var(--main-color1)"}
          >
            <Span verticalAlign={"baseline"}>{total}</Span>
            <Span verticalAlign={"baseline"}>원 결제</Span>
          </P>
        </Button>
      </div>
    </VerticalFlex>
  );
}
