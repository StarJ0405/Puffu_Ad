"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { toast, validateInputs } from "@/shared/utils/Functions";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function () {
  const inputs = useRef<any[]>([]);
  const image = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const handleSave = () => {
    setIsLoading(true);
    try {
      const name = inputs.current[0].getValue();
      if (!name) {
        return setError("입점사명이 입력되지 않았습니다.");
      }
      validateInputs([...inputs.current, image.current])
        .then(({ isValid }: { isValid: boolean }) => {
          if (!isValid) return;

          const thumbnail = image.current.getValue();
          const description = inputs.current[1].getValue();

          const _data: BrandDataFrame = {
            name,
          };
          _data.thumbnail = thumbnail;
          if (description) _data.description = description;

          adminRequester.createBrand(
            _data,
            ({ message, error }: { message?: string; error?: string }) => {
              setIsLoading(false);
              if (message) navigate("/brand/management");
              else if (error) setError(error);
            }
          );
        })
        .catch(() => {
          toast({ message: "오류가 발생했습니다." });
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };
  useClientEffect(() => {
    if (error) {
      setIsLoading(false);
      toast({ message: error });
    }
  }, [error]);
  return (
    <div className={styles.container}>
      <VerticalFlex>
        <FlexChild>
          <div className={styles.label}>
            <Center width={"100%"} textAlign={"left"}>
              <P size={25} weight={600}>
                입점사 등록
              </P>
            </Center>
          </div>
        </FlexChild>
        <FlexChild>
          <div className={styles.contentWrap}>
            <VerticalFlex>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      입점사명
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <Input
                      width={"100%"}
                      ref={(el) => {
                        inputs.current[0] = el;
                      }}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      대표 이미지
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <InputImage
                      ref={image}
                      placeHolder="1:1 비율의 이미지를 권장합니다."
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      간단 설명
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <Input
                      width={"100%"}
                      ref={(el) => {
                        inputs.current[1] = el;
                      }}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild justifyContent={"center"} marginTop={30}>
                <Button
                  styleType="admin"
                  isLoading={isLoading}
                  onClick={handleSave}
                  fontSize={18}
                  fontWeight={700}
                  borderRadius={5}
                  padding={"15px 74px"}
                >
                  등록
                </Button>
              </FlexChild>
            </VerticalFlex>
          </div>
        </FlexChild>
      </VerticalFlex>
    </div>
  );
}
