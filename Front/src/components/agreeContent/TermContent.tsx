import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";

import styles from "./agreeContent.module.css";

type Props = {
  size?: number | string;
};

export default function TermContent({ size = 10 }: Props) {
  return (
    <VerticalFlex className={styles.board_container} fontSize={size}>
      <FlexChild justifyContent="center">
        <h3>약관</h3>
      </FlexChild>
      <VerticalFlex>
        <P className={styles.title}>제1장 총칙</P>
        <VerticalFlex gap={5}>
          <P className={styles.txt1}>
            제1조 (목적) 본 약관은 푸푸(이하 "회사")이 운영하는 쇼핑몰(이하
            "몰")에서 제공하는 서비스를 이용함에 있어 회사와 이용자의 권리, 의무
            및 책임사항을 규정함을 목적으로 합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제2조 (정의)</P>
          <P className={styles.txt1}>
            "몰"이란 회사가 재화 또는 서비스를 이용자에게 제공하기 위하여 컴퓨터
            등 정보통신설비를 이용하여 재화 또는 서비스를 거래할 수 있도록
            설정한 가상의 영업장을 말합니다.
            <br />
            <br />
            "이용자"란 "몰"에 접속하여 본 약관에 따라 "몰"이 제공하는 서비스를
            받는 회원 및 비회원을 말합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제3조 (약관의 명시와 개정)</P>
          <P className={styles.txt1}>
            본 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소, 전화번호,
            전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보
            보호책임자 등을 이용자가 쉽게 알 수 있도록 게시합니다.
            <br />
            <br />
            "몰"은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의
            규제에 관한 법률」, 「전자문서 및 전자거래기본법」,
            「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및
            정보보호 등에 관한 법률」, 「소비자기본법」 등 관련 법령을 위배하지
            않는 범위에서 본 약관을 개정할 수 있습니다.
            <br />
            <br />
            "몰"이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행
            약관과 함께 "몰"의 초기화면에 그 적용일자 7일 이전부터 적용일자
            전일까지 공지합니다.
            <br />
            <br />이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는
            전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한
            법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및
            관련법령 또는 상관례에 따릅니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제2장 서비스의 이용</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제4조 (서비스의 제공 및 변경)</P>
          <P className={styles.txt1}>
            "몰"은 다음과 같은 서비스를 제공합니다.
            <br />
            <br />
            가. 제품 검색 및 구매 서비스
            <br />
            나. 회원 가입 및 관리 서비스
            <br />
            다. 결제 및 배송 서비스
            <br />
            라. 기타 회사가 제공하는 부가 서비스
            <br />
            <br />
            변경된 서비스의 내용 및 제공일자를 명시하여 즉시 공지합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제5조 (서비스의 중단)</P>
          <P className={styles.txt1}>
            "몰"은 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절
            등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수
            있습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제3장 회원가입 및 관리</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제6조 (회원 가입 및 이용)</P>
          <P className={styles.txt1}>
            이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에
            동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
            <br />
            <br />
            회원 가입 시, 정확하고 최신의 정보를 제공해야 하며, 이를 기반으로
            서비스가 제공됩니다.
            <br />
            <br />
            회원은 언제든지 본 플랫폼에서 제공하는 서비스에 가입하고 이용할 수
            있으며, 탈퇴도 가능합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제7조 (회원의 의무)</P>
          <P className={styles.txt1}>
            1. 타인의 개인정보나 계정을 침해하는 행위 금지
            <br />
            2. 불법적인 상품 판매 및 구매 행위 금지
            <br />
            3. 회사의 서비스를 이용하여 부정한 이득을 취하는 행위 금지
            <br />
            4. 서비스 제공을 방해하는 행위 금지
            <br />
            5. 다른 회원에게 불쾌감을 주는 행위 금지
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제8조 (서비스의 이용 및 제한)</P>
          <P className={styles.txt1}>
            회사는 서비스 이용 중단, 일시적인 중지, 변경을 할 수 있으며, 이로
            인해 발생하는 피해에 대해 책임을 지지 않습니다.
            <br />
            <br />
            회사는 불법적인 목적으로 서비스를 이용하는 회원에 대해 즉시 서비스
            제공을 중단할 수 있습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제9조 (회원 가입)</P>
          <P className={styles.txt1}>
            "몰"은 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지
            않는 한 회원으로 등록합니다.
            <br />
            <br />
            가. 가입신청자가 본 약관 제7조 제3항에 의하여 이전에 회원자격을
            상실한 적이 있는 경우, 다만 제7조 제3항에 의한 회원자격 상실 후
            3년이 경과한 자로서 "몰"의 회원 재가입 승낙을 얻은 경우에는 예외로
            함.
            <br />
            나. 등록 내용에 허위, 기재누락, 오기가 있는 경우.
            <br />
            다. 기타 회원으로 등록하는 것이 "몰"의 기술상 현저히 지장이 있다고
            판단되는 경우.
            <br />
            <br />
            회원가입계약의 성립 시기는 "몰"의 승낙이 회원에게 도달한 시점으로
            합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제10조 (회원 탈퇴 및 자격 상실 등)</P>
          <P className={styles.txt1}>
            회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시
            회원탈퇴를 처리합니다.
            <br />
            <br />
            회원이 다음 각 호의 사유에 해당하는 경우, "몰"은 회원자격을 제한 및
            정지시킬 수 있습니다.
            <br />
            <br />
            가. 가입 신청 시에 허위 내용을 등록한 경우.
            <br />
            나. 다른 사람의 정보를 도용하는 등 전자상거래 질서를 위협하는 경우.
            <br />
            다. "몰"을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는
            행위를 하는 경우.
            <br />
            <br />
            "몰"이 회원 자격을 제한·정지 시킨 후, 동일한 행위가 2회 이상
            반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 "몰"은
            회원자격을 상실시킬 수 있습니다.
            <br />
            <br />
            "몰"이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우
            회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을
            정하여 소명할 기회를 부여합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제4장 주문 및 결제</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제11조 (구매신청)</P>
          <P className={styles.txt1}>
            이용자는 "몰"상에서 다음 또는 이와 유사한 방법에 의하여 구매를
            신청하며, "몰"은 이용자가 구매신청을 함에 있어서 다음의 각 내용을
            알기 쉽게 제공하여야 합니다.
            <br />
            <br />
            가. 상품 검색 및 선택.
            <br />
            나. 받는 사람의 성명, 주소, 전화번호, 전화번호 등의 입력.
            <br />
            다. 약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의
            비용부담과 관련한 내용에 대한 확인.
            <br />
            라. 이 약관에 동의하고 위 사항을 확인하거나 거부하는 표시(예, 마우스
            클릭).
            <br />
            마. 상품 등의 구매신청 및 이에 관한 확인 또는 "몰"의 확인에 대한
            동의.
            <br />
            바. 결제방법의 선택.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제12조 (계약의 성립)</P>
          <P className={styles.txt1}>
            "몰"은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수
            있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의
            동의가 필요하며 미성년자 본인 또는 법정대리인이 계약을 취소할 수
            있다는 내용을 고지하여야 합니다.
            <br />
            <br />
            가. 신청 내용에 허위, 기재누락, 오기가 있는 경우.
            <br />
            나. 미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및
            용역을 구매하는 경우.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제13조 (지급방법)</P>
          <P className={styles.txt1}>
            "몰"에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의
            방법 중 가용한 방법으로 할 수 있습니다. 단, "몰"은 이용자의
            지급방법에 대하여 재화 등의 대금에 대한 어떠한 할인도 제공하지
            않습니다.
            <br />
            <br />
            온라인 결제
            <br />
            전자화폐에 의한 결제 (토스페이먼츠, nestpay 등)
            <br />
            기타 전자적 지급 방법에 의한 대금 지급 등
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>
            제14조 (수신확인통지, 구매신청 변경 및 취소)
          </P>
          <P className={styles.txt1}>
            "몰"은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를
            합니다.
            <br />
            <br />
            수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는
            수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고
            "몰"은 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에
            따라 처리하여야 합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제6장 청약철회 및 환불</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제15조 (청약철회 등)</P>
          <P className={styles.txt1}>
            "몰"과 상품의 구매에 관한 계약을 체결한 이용자는 수신확인의 통지를
            받은 날부터 7일 이내에 청약을 철회할 수 있습니다. 다만, 청약철회에
            관하여 「전자상거래 등에서의 소비자보호에 관한 법률」에 달리 정함이
            있는 경우에는 동 법 규정에 따릅니다.
            <br />
            <br />
            이용자는 상품을 배송 받은 경우 다음 각 호의 경우에는 청약철회 및
            교환을 할 수 없습니다.
            <br />
            <br />
            가. 이용자에게 책임 있는 사유로 상품이 멸실 또는 훼손된 경우
            <br />
            나. 이용자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히
            감소한 경우
            <br />
            다. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 현저히
            감소한 경우
            <br />
            라. 해외 배송 시스템상 배송 시 파손 가능성이 있으며 이를 인지하여
            주문하는 것으로 간주. 배송 파손으로 요청한 경우
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제7장 개인정보 및 보안</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제16조 (개인정보보호)</P>
          <P className={styles.txt1}>
            "몰"은 이용자의 개인정보 수집시 서비스 제공을 위하여 필요한 범위에서
            최소한의 개인정보를 수집합니다.
            <br />
            <br />
            "몰"은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지
            않습니다. 다만, 관련 법령상 의무이행을 위하여 구매계약 이전에
            본인확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는
            경우에는 그러하지 아니합니다.
            <br />
            <br />
            "몰"은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그
            목적을 고지하고 동의를 받습니다.
            <br />
            <br />
            "몰"은 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운
            이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는
            이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를
            받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
            <br />
            <br />
            "몰"이 제3항과 제4항에 의해 이용자의 동의를 받아야 하는 경우에는
            개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처),
            정보의 수집목적 및 이용목적, 제3자에 대한 정보제공
            관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망
            이용촉진 및 정보보호 등에 관한 법률」 제22조 제2항이 규정한 사항을
            미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수
            있습니다.
            <br />
            <br />
            이용자는 언제든지 "몰"이 가지고 있는 자신의 개인정보에 대해 열람 및
            오류정정을 요구할 수 있으며 "몰"은 이에 대해 지체 없이 필요한 조치를
            취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 "몰"은 그
            오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
            <br />
            <br />
            "몰"은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를
            최소한으로 제한하여야 하며 신용카드, 은행계좌 등을 포함한 이용자의
            개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한
            이용자의 손해에 대하여 모든 책임을 집니다.
            <br />
            <br />
            "몰" 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적
            또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체 없이
            파기합니다.
            <br />
            <br />
            "몰"은 개인정보의 수집·이용·제공에 관한 동의 란을 미리 선택한 것으로
            설정해두지 않습니다. 또한 개인정보의 수집·이용·제공에 관한 이용자의
            동의거절시 제한되는 서비스를 구체적으로 명시하고, 필수수집항목이
            아닌 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절을 이유로
            회원가입 등 서비스 제공을 제한하거나 거절하지 않습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제17조 (정보보안)</P>
          <P className={styles.txt1}>
            "몰"은 이용자의 개인정보 및 결제정보를 보호하기 위해 최신 암호화
            기술과 보안 시스템을 사용합니다.
            <br />
            <br />
            "몰"은 정기적인 보안 점검을 통해 정보보안 수준을 유지하며, 보안
            취약점 발견 시 즉시 조치를 취합니다.
            <br />
            <br />
            이용자는 자신의 계정 정보를 안전하게 관리할 책임이 있으며, 계정
            도용이나 무단 접근 시도를 발견한 경우 즉시 "몰"에 신고해야 합니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <P className={styles.title}>제8장 분쟁해결 및 기타</P>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제18조 (분쟁해결)</P>
          <P className={styles.txt1}>
            "몰"은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를
            보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            <br />
            <br />
            "몰"은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을
            처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와
            처리일정을 즉시 통보해 드립니다.
            <br />
            <br />
            "몰"과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의
            피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가
            의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제19조 (관할법원 및 준거법)</P>
          <P className={styles.txt1}>
            "몰"은 천재지변, 전쟁 및 기타 이에 준하는 불가항력으로 인하여
            서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
            면제됩니다.
            <br />
            <br />
            "몰"은 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을
            지지 않습니다.
            <br />
            <br />
            "몰"은 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여
            책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에
            관하여 책임을 지지 않습니다.
            <br />
            <br />
            "몰"은 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에
            관해서는 책임을 지지 않습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제20조 (책임의 한계)</P>
          <P className={styles.txt1}>
            "몰"은 천재지변, 전쟁 및 기타 이에 준하는 불가항력으로 인하여
            서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
            면제됩니다.
            <br />
            <br />
            "몰"은 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을
            지지 않습니다.
            <br />
            <br />
            "몰"은 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여
            책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에
            관하여 책임을 지지 않습니다.
            <br />
            <br />
            "몰"은 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에
            관해서는 책임을 지지 않습니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제21조 (약관의 효력)</P>
          <P className={styles.txt1}>
            본 약관은 2025.07.24부터 시행합니다.
            <br />
            <br />본 약관에서 정하지 않은 사항과 본 약관의 해석에 관하여는
            전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률,
            공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관련
            법령 또는 상관례에 따릅니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>

      <VerticalFlex>
        <VerticalFlex gap={5}>
          <P className={styles.sub_title}>제22조 (배송안내)</P>
          <P className={styles.txt1}>
            배송업체 : CJ 대한통운 (1588-1255)
            <br />
            <br />
            배송지역 : 대한민국 전 지역
            <br />
            <br />
            배송비용 : 3000원 /5만원 이상 시 무료 배송/ 도서산간 지역 별도 추가
            금액 발생
            <br />
            <br />
            배송기간 : 주말·공휴일 제외 2-5일
            <br />
            <br />
            주문이 폭주하거나 공급사의 사정으로 인해 지연 및 품절이 발생될 수
            있습니다.
            <br />
            <br />
            안내드린 배송기간이상 소요되거나 상품이 품절되면 개별연락 드립니다.
          </P>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
