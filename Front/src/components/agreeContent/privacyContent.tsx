import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";

import clsx from "clsx";
import styles from './page.module.css'
import boardStyle from '../../boardGrobal.module.css'

// import { AgreementStep } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

export default function PrivacyContent() {

   return (
      <FlexChild>
         <P>
            개인정보 처리방침
푸푸글로벌(이하 “회사”)가 운영하는 푸푸토이(이하 “사이트”)은 「개인정보보호법」, 「정보통신망법」, 「전자상거래법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위하여 최선을 다하고 있습니다.
본 개인정보 처리방침은 회사가 어떤 개인정보를 수집·이용하고, 어떠한 목적으로 사용하는지, 누구에게 제공하는지, 얼마나 보관하는지 등에 대해 규정합니다.
1. 개인정보 수집 항목
회사는 회원가입, 본인확인, 쇼핑몰 이용, 서비스 신청 및 제공, 고객상담, 마케팅 및 광고 활용 등을 위하여 아래와 같은 개인정보를 수집합니다.
회사는 원칙적으로 주민등록번호 및 아이핀 정보를 직접 수집하지 않습니다.

가. 수집하는 항목

1. 회원가입 시
- 필수항목: 성명, 전자우편주소(ID), 비밀번호, 휴대전화번호, 본인인증정보(휴대폰 인증), 생년월일(성인인증 목적)
- 선택항목: 주소, 별명, 프로필 이미지

2. 간편 로그인 시
- 네이버 아이디 로그인: 네이버 제공 프로필 정보(이메일, 이름/닉네임, 성별, 생년월일 등 선택 동의 범위에 따라 수집)

3. 비회원 구매 시
- 필수항목: 주문자 성명, 연락처, 결제자 주소, 수취인 성명, 배송지 주소, 배송 연락처
- 선택항목: 고객메모, 이메일

4. 결제 및 환불 시
- 결제기록, 환불계좌 정보(은행명, 계좌번호, 예금주명)

5.서비스 이용 시 자동으로 수집되는 항목
- 서비스 이용기록, 접속로그, 쿠키(cookie), 접속 IP, 단말기 정보(OS/브라우저/기기종류), 광고식별자(ADID/IDFA 등), 결제기록

6. 마케팅 및 광고 활용
- 구글 애널리틱스, 구글 광고(리마케팅 포함)를 통한 자동 수집 정보(쿠키, 방문 이력, 관심사 기반 데이터 등)

나. 수집 방법

- 홈페이지 및 모바일 웹/앱 회원가입
- 상품 주문, 배송 요청, 환불/취소 처리 과정
- 고객센터(전화, 이메일, 1:1 문의, 채팅상담)
- 자동생성정보(쿠키, 로그, 광고식별자 등)

2. 개인정보 수집·이용 목적
1. 회원 관리
- 본인확인, 성인인증(청소년보호법 준수)
- 가입·탈퇴 의사 확인 및 본인 확인
- 회원자격 유지·관리 및 부정 이용 방지

2. 서비스 제공
- 상품 주문, 결제, 배송, 환불 및 교환 처리
- 고객 상담 및 민원 처리
- 구매 내역 및 서비스 이용 기록 관리


3. 마케팅 및 광고 활용
- 맞춤형 서비스 및 광고 제공(구글 광고·리마케팅 등)
- 이벤트·프로모션 및 광고성 정보 제공(수신 동의 시)
- 신규 서비스 개발 및 고객 맞춤형 서비스 제공

4 서비스 이용 분석 및 보안
- 서비스 이용 기록·접속 빈도 통계 분석
- 해킹·부정 이용 방지 및 보안 강화
3. 개인정보 제3자 제공
회사는 원칙적으로 이용자의 개인정보를 사전 동의 없이 제3자에게 제공하지 않습니다.
다만, 서비스 제공 및 계약 이행을 위해 불가피한 경우 다음과 같이 제공합니다.

1) 배송 및 물류 서비스
- CJ대한통운택배 : 상품 배송, 배송조회, 반품·교환 처리 (성명, 주소, 휴대전화번호, 주문번호)

2) 결제 서비스
- 다페이 주식회사(PG사) : 결제 승인 및 정산 처리 (성명, 결제수단 정보, 승인번호 등)

3) 본인인증 서비스
- 드림시큐리티 주식회사 : 성인인증 및 본인확인 (성명, 생년월일, 성별, 휴대전화번호, 통신사, CI/DI 등)


※ 보유 및 이용기간 : 회원 탈퇴 시 또는 제휴·위탁 계약 종료 시까지. 단, 법령상 보관 의무가 있는 경우 해당 기간까지 보관.
4. 개인정보 보유 및 이용기간
회사는 개인정보 수집·이용 목적이 달성되면 원칙적으로 지체 없이 파기합니다.
다만 법령에 따라 일정 기간 보관해야 하는 경우 아래와 같이 보존합니다.

1) 법령에 따른 보존 항목
- 표시·광고 기록 : 6개월 (전자상거래법)
- 계약·청약철회 기록 : 5년 (전자상거래법)
- 대금결제·재화 공급 기록 : 5년 (전자상거래법)
- 소비자 불만·분쟁처리 기록 : 3년 (전자상거래법)
- 신용정보 수집·이용 기록 : 3년 (신용정보법)
- 본인확인(성인인증 포함) 기록 : 6개월 (정보통신망법)
- 접속 기록 : 3개월 (통신비밀보호법)

2) 서비스 특수 목적 보존
- 간편 로그인(네이버) 정보 : 회원 탈퇴 시 즉시 파기
- 광고·분석 서비스 데이터(쿠키, 광고식별자 등) : 서비스 목적 달성 시 즉시 파기 (이용자 브라우저·단말기 설정으로 직접 삭제 가능)

3) 회원 개별 동의
- 별도 동의 시, 동의받은 기간까지 보관
5. 개인정보 파기 절차 및 방법
- 보존기간이 지난 개인정보는 즉시 파기합니다.
- 전자적 파일은 복구 불가능한 기술적 방법으로 영구 삭제하며,
- 종이 문서는 분쇄 또는 소각을 통해 파기합니다.

※ 개인정보보호 책임자
성명 : 염희하
연락처 : 010-8112-6191
이메일 : puffuglobal@gmail.com
         </P>
      </FlexChild>
   )


}