"use client";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import clsx from "clsx";
import boardStyle from "../boardGrobal.module.css";
import styles from "./page.module.css";

// 게시판 쓰기 -----------------------------------------------
export function BoardTitleBox() {
  return (
    <HorizontalFlex className={boardStyle.board_titleBox}>
      <FlexChild>
        {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
        <h3>공지사항</h3>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function WriteFrame() {
  return (
    <VerticalFlex className={styles.write_container}>
      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={styles.input_box}>
          <Span>문의유형</Span>
          <FlexChild className={styles.select}>
            <Select
              classNames={{
                  header: 'web_select',
                  placeholder: 'web_select_placholder',
                  line: 'web_select_line',
                  arrow: 'web_select_arrow',
                  search: 'web_select_search',
              }}
              options={[
                 { value: "회원정보 관리", display: "회원정보 관리" },
                 { value: "주문/결제", display: "영수증/증빙서류" },
                 { value: "상품/이벤트", display: "상품/이벤트" },
                 { value: "기타", display: "기타" },
              ]}
              placeholder={'문의 유형 선택'}
              // value={selectedMessageOption}
            />
          </FlexChild>
        </FlexChild>

        <FlexChild className={styles.input_box}>
          <FlexChild>
            <CheckboxGroup name={"comment"}>
              <label>
                <FlexChild gap={10}>
                  <Span>댓글 기능</Span>
                  <CheckboxChild id={"comment_Check"} />
                </FlexChild>
              </label>
            </CheckboxGroup>
          </FlexChild>

          {/* <FlexChild>
            <CheckboxGroup name={"notice"}>
              <label>
                <FlexChild gap={10}>
                  <Span>공지사항</Span>
                  <CheckboxChild id={"notice_Check"} />
                </FlexChild>
              </label>
            </CheckboxGroup>
          </FlexChild> */}
        </FlexChild>
      </HorizontalFlex>

      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={styles.input_box}>
          <Span>작성자</Span>
          <FlexChild >
            <Input
              type={"text"}
              placeHolder="이름을 입력해 주세요."
              className={'web_input'}
            />
          </FlexChild>
        </FlexChild>

        <FlexChild className={styles.input_box}>
          <Span>비밀번호</Span>
          <FlexChild >
            <Input
              type={"password"}
              placeHolder="비밀번호를 입력해 주세요."
              className={'web_input'}
            />
          </FlexChild>
        </FlexChild>
      </HorizontalFlex>

      <HorizontalFlex className={styles.input_group} justifyContent="start">
        <FlexChild className={clsx(styles.input_box, styles.title_input)}>
          <Span>제목</Span>
          <FlexChild>
            <Input
              type={"text"}
              placeHolder="제목을 입력해 주세요."
              className={'web_input'}
              width={'100%'}
            />
          </FlexChild>
        </FlexChild>

        <FlexChild width={'auto'} marginLeft={40}>
          <Button className={styles.save_btn}>임시저장</Button>
        </FlexChild>
      </HorizontalFlex>

      <FlexChild>
        <InputTextArea className={styles.content_textArea} placeHolder="내용을 입력해 주세요." />
        {/* 어드민에 쓰는 에디터 달기 */}
      </FlexChild>

      <VerticalFlex className={styles.fileUpload_box} alignItems="start">
        <P>이미지 첨부파일 추가</P>
        <FlexChild className={styles.upload_body} justifyContent="center">
          {/* 파일 첨부 버튼 onClick 걸기 */}
          <VerticalFlex gap={5} width={85} className={styles.thumbnail}>
            <FlexChild width={'auto'}>
              <Image
                src={"/resources/images/file_unknown_thumbnail.png"}
                width={85}
              />
            </FlexChild>
            <P size={14} color="#fff">파일 첨부</P>
          </VerticalFlex>

          {/* 이미지 첨부 시 나오는 파일*/}
          <VerticalFlex gap={5}  width={85} className={styles.thumbnail}>
            <FlexChild width={'auto'}>
                <div 
                  style={
                    {
                      backgroundImage: "url('/resources/images/dummy_img/product_06.png')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      backgroundRepeat: 'no-repeat',
                      width: '85px',
                      height: '85px',
                    }
                  }
                ></div>
            </FlexChild>
            <P lineClamp={1} overflow="hidden" display="--webkit-box" size={14} color="#fff">첨부된 파일</P>
          </VerticalFlex>

          {/* 파일 드래그 영역 */}
          <FlexChild justifyContent="center" width={'auto'} height={'100%'}>
            <P size={18} color="#868686">여기에 파일을 끌어놓거나 파일 첨부 버튼을 클릭하세요.</P>
          </FlexChild>
        </FlexChild>
        
      </VerticalFlex>

      <VerticalFlex className={styles.privacy_box} gap={15}>
        <FlexChild className={styles.title}>
          <P>개인정보 수집 동의</P>
        </FlexChild>

        <FlexChild className={'agree_content'}>
          <PrivacyContent />
        </FlexChild>

        <FlexChild>
          <CheckboxGroup name="privacy_check" className={styles.checkBox}>
            <label>
              <FlexChild gap={10}>
                <CheckboxChild id="privacy_input" />
                <P>개인정보수집에 동의합니다.</P>
              </FlexChild>
            </label>
          </CheckboxGroup>
        </FlexChild>
      </VerticalFlex>

      <FlexChild className={styles.button_group}>
        <Button className={styles.cancel_btn}>작성 취소</Button>
        <Button className={styles.submit_btn}>문의하기</Button>
      </FlexChild>
    </VerticalFlex>
  );
}

// 게시판 쓰기 end -----------------------------------------------
