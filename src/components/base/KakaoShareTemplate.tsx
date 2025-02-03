import React, { useEffect, useRef, useState } from "react";
import InputTextBox from "@/components/base/InputText";
import { KakaoShareArgs } from "@/lib/item/types";

interface KakaoShareProps {
  page_type: string;
  disableInput: boolean;
  kakaoShareArgs: KakaoShareArgs;
  image: string;
  shop_logo: string;
  image_result?: string;
  shop_logo_result?: string;
  setKakaoShareArgs: (kakaoShareArgs: KakaoShareArgs) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeImage: (
    imgType: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTempImageDelete: (imgType: string) => void;
}

const KakaoShareTemplate: React.FC<KakaoShareProps> = ({
  page_type,
  disableInput,
  image,
  shop_logo,
  image_result,
  shop_logo_result,
  kakaoShareArgs,
  setKakaoShareArgs,
  handleKeyDown,
  onChangeImage,
  handleTempImageDelete,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-4";
  const labelClass = "text-xs pt-4 text-gray-500";
  const imageFileInput = useRef<HTMLInputElement>(null);
  const shopLogoFileInput = useRef<HTMLInputElement>(null);
  const [shop_name, setShop_name] = useState(kakaoShareArgs.shop_name);
  const [title, setTitle] = useState(kakaoShareArgs.title);
  const [description, setDescription] = useState(kakaoShareArgs.description);
  const [button_name, setButton_name] = useState(kakaoShareArgs.button_name);

  useEffect(() => {
    setKakaoShareArgs({
      shop_name,
      title,
      description,
      button_name,
      image: image,
      shop_logo: shop_logo,
    });
  }, [shop_name, title, description, button_name]);

  return (
    <>
      <div className="lg:flex lg:gap-4">
        <div className="contents-container w-full pt-4">
          <label className="pt-4 font-bold text-gray-500">
            카카오 메시지 설정
          </label>

          <div className="flex w-full items-center justify-center rounded-xl bg-gray-200 lg:w-fit lg:items-start lg:justify-start lg:bg-transparent">
            <div className="relative my-4">
              <div className="mx-auto hidden w-[200px] lg:block lg:w-[290px]">
                <img
                  src="/images/kakao/kakao-message-template.png"
                  alt="Phone Mockup"
                />
              </div>

              <div className="left-0 top-0 lg:absolute lg:left-[40px] lg:top-[85px]">
                <div className="shadow-card_shadow flex h-full max-w-full flex-col items-center justify-center rounded-lg bg-white">
                  <div className="min-h-full w-[230px] min-w-full overflow-hidden rounded-lg">
                    <div className="h-[230px] w-[230px] cursor-pointer">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/jpg,image/png,image/jpeg"
                        name="image_result"
                        onChange={onChangeImage("image")}
                        ref={imageFileInput}
                        disabled={disableInput}
                      />
                      <div
                        className="group relative flex h-full w-full items-center justify-center"
                        onClick={() => imageFileInput.current?.click()}
                      >
                        {page_type === "NEW" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
                            <span className="text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              사진 업로드
                              <br />
                              (80px * 80px)
                            </span>
                          </div>
                        )}
                        <img
                          className="h-full w-full"
                          src={
                            page_type === "DETAILS" && image !== ""
                              ? image
                              : image_result ||
                                "/images/kakao/kakaolink-no-logo-default.png"
                          }
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/kakao/kakaolink-no-logo-default.png";
                          }}
                          alt="Selected"
                        />
                      </div>
                    </div>
                    <div className="box-border flex h-[calc(100%-460px)] min-w-full flex-col items-start justify-between">
                      <div className="mb-2 flex min-w-full flex-col justify-start px-[10px]">
                        <div className="flex flex-row items-center justify-start border-b border-gray-100 py-[10px]">
                          <div className="h-[23px] w-[23px] cursor-pointer rounded-[8px] border border-gray-300">
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="image/jpg,image/png,image/jpeg"
                              name="shop_logo_result"
                              onChange={onChangeImage("shop_logo")}
                              ref={shopLogoFileInput}
                              disabled={disableInput}
                            />
                            <div
                              className="group relative flex h-full w-full items-center justify-center"
                              onClick={() => shopLogoFileInput.current?.click()}
                            >
                              <img
                                className="h-full w-full"
                                src={
                                  page_type === "DETAILS" && shop_logo !== ""
                                    ? shop_logo
                                    : shop_logo_result ||
                                      "/images/kakao/kakaolink-no-logo-default.png"
                                }
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/kakao/kakaolink-no-logo-default.png";
                                }}
                                alt="Shop Logo"
                                style={{ borderRadius: "35%" }}
                              />
                            </div>
                          </div>
                          <p className="ml-1 text-[14px] font-normal">
                            {shop_name}
                          </p>
                        </div>
                        <div className="pt-[10px] text-[14px]">
                          <p
                            style={{
                              letterSpacing: "-0.8px",
                              lineHeight: "17px",
                            }}
                          >
                            {title}
                          </p>
                        </div>
                      </div>
                      <div className="break-words px-[10px] text-[13px] opacity-50">
                        <p
                          style={{
                            letterSpacing: "-0.3px",
                            lineHeight: "17px",
                          }}
                        >
                          {description}
                        </p>
                      </div>

                      <div className="flex min-w-full flex-col items-center justify-end gap-0 pt-[10px]">
                        <button className="center mx-auto mb-1 h-[36px] w-[calc(100%-20px)] rounded-md bg-[#f1f2f4] text-[13px] focus:outline-none">
                          {button_name}
                        </button>
                        <div className="mt-1 box-border min-w-full cursor-pointer items-center justify-between bg-white px-[10px] py-[6px]">
                          <a
                            href="https://www.incento.kr"
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-w-full flex-row items-center justify-between"
                          >
                            <div className="flex select-none flex-row items-center gap-1">
                              <div
                                className="h-[16px] w-[16px] border border-gray-300"
                                style={{ borderRadius: "35%" }}
                              >
                                <img
                                  className="h-full w-full"
                                  src={
                                    page_type === "DETAILS" && shop_logo !== ""
                                      ? shop_logo
                                      : shop_logo_result ||
                                        "/images/kakao/kakaolink-no-logo-default.png"
                                  }
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/images/kakao/kakaolink-no-logo-default.png";
                                  }}
                                  alt="Shop Logo"
                                  style={{ borderRadius: "35%" }}
                                />
                              </div>
                              <p className="text-xs text-gray-400">
                                {shop_name}
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-fit w-full flex-col">
            <div className={inputFormClass}>
              <label className={labelClass}>Shop Name</label>
              <InputTextBox
                type="text"
                id="shop_name"
                placeholder="숍 이름을 입력하세요."
                value={shop_name}
                onChange={(e) => setShop_name(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disableInput}
              />
            </div>
            <div className={inputFormClass}>
              <label className={labelClass}>메시지 타이틀</label>
              <InputTextBox
                type="text"
                id="title"
                placeholder="카카오 공유 메시지 타이틀을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disableInput}
              />
            </div>
            <div className={inputFormClass}>
              <label className={labelClass}>메시지 설명</label>
              <InputTextBox
                type="text"
                id="description"
                placeholder="메시지 설명을 입력하세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disableInput}
              />
            </div>
            <div className={inputFormClass}>
              <label className={labelClass}>버튼 이름</label>
              <InputTextBox
                type="text"
                id="button_name"
                placeholder="버튼 이름을 입력하세요."
                value={button_name}
                onChange={(e) => setButton_name(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disableInput}
              />
            </div>
            <div className={inputFormClass}>
              <label className={labelClass}>이미지 삭제</label>
              <div className="flex gap-[5px]">
                <button
                  className="w-fit min-w-[80px] rounded-lg bg-red-600 p-[5px] text-white"
                  onClick={async () => {
                    try {
                      await handleTempImageDelete("image");
                    } catch (error) {
                      console.error("Failed to delete image:", error);
                    }
                  }}
                >
                  썸네일 삭제
                </button>
                <button
                  className="w-fit min-w-[80px] rounded-lg bg-red-600 p-[5px] text-white"
                  onClick={async () => {
                    try {
                      await handleTempImageDelete("shop_logo");
                    } catch (error) {
                      console.error("Failed to delete image:", error);
                    }
                  }}
                >
                  로고 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KakaoShareTemplate;
