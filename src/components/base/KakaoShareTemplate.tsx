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
  onChangeImage?: (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}) => {
  console.log("kakaoShareArgs", kakaoShareArgs);
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-4";
  const labelClass = "text-xs pt-4 text-gray-500";
  const imageFileInput = useRef<HTMLInputElement>(null);
  const shopLogoFileInput = useRef<HTMLInputElement>(null);
  const [shop_name, setShop_name] = useState(kakaoShareArgs.shop_name);
  const [title, setTitle] = useState(kakaoShareArgs.title);
  const [description, setDescription] = useState(kakaoShareArgs.description);
  const [button_name, setButton_name] = useState(kakaoShareArgs.button_name);
  const [img_url, setImg_url] = useState(image);
  const [shop_logo_url, setShop_logo_url] = useState(shop_logo);

  const baseUrl = process.env.NEXT_PUBLIC_AWS_BASE_URL;

  useEffect(() => {
    setImg_url(image);
    setShop_logo_url(shop_logo);
    setKakaoShareArgs({
      shop_name,
      title,
      description,
      button_name,
      image: img_url,
      shop_logo: shop_logo_url,
    });
  }, [shop_name, title, description, button_name, img_url, shop_logo_url]);

  return (
    <>
      <div className="contents-container w-full pt-4">
        <label className="pt-4 font-bold text-gray-500">카카오 메시지 설정</label>
        <div className="block lg:flex lg:gap-4">
          <div className="bg-gray-200 lg:bg-transparent w-full lg:w-fit flex items-center lg:items-start justify-center lg:justify-start rounded-xl">
            <div className="relative my-4">
              <div className="hidden lg:block w-[200px] lg:w-[290px] mx-auto">
                <img src="/images/kakao/kakao-message-template.png" alt="Phone Mockup" />
              </div>
              <div className="lg:absolute top-0 lg:top-[85px] left-0 lg:left-[40px]">
                <div className="flex h-full max-w-full flex-col items-center justify-center rounded-lg bg-white shadow-card_shadow">
                  <div className="min-h-full min-w-full w-[230px] overflow-hidden rounded-lg">
                    <div className="h-[230px] w-[230px] cursor-pointer">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/jpg,image/png,image/jpeg"
                        name="image_result"
                        onChange={onChangeImage ? onChangeImage("image") : undefined}
                        ref={imageFileInput}
                        disabled={disableInput}
                      />
                      <div
                        className="relative h-full w-full flex items-center justify-center group"
                        onClick={() => imageFileInput.current?.click()}
                      >
                        {page_type === "NEW" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              사진 업로드
                            </span>
                          </div>
                        )}
                        <img
                          className="h-full w-full"
                          src={
                            page_type === "DETAILS"
                              ? `${img_url}`
                              : image_result || "/images/kakao/kakaolink-no-logo-default.png"
                          }
                          alt="Selected"
                          onError={(e) => {
                            e.currentTarget.src = "/images/kakao/kakaolink-no-logo-default.png";
                          }}
                        />
                      </div>
                    </div>
                    <div className="box-border flex h-[calc(100%-460px)] min-w-full flex-col items-start justify-between">
                      <div className="mb-2 flex min-w-full flex-col justify-start px-[10px]">
                        <div className="flex flex-row items-center justify-start border-b border-gray-100 py-[10px]">
                          <div className="h-[23px] w-[23px] rounded-[8px] border border-gray-300 cursor-pointer">
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="image/jpg,image/png,image/jpeg"
                              name="shop_logo_result"
                              onChange={onChangeImage ? onChangeImage("shop_logo") : undefined}
                              ref={shopLogoFileInput}
                              disabled={disableInput}
                            />
                            <div
                              className="relative h-full w-full flex items-center justify-center group"
                              onClick={() => shopLogoFileInput.current?.click()}
                            >
                              <img
                                className="h-full w-full rounded-[8px]"
                                src={
                                  page_type === "DETAILS"
                                    ? `${shop_logo_url}`
                                    : shop_logo_result || "/images/kakao/kakaolink-no-logo-default.png"
                                }
                                alt="Selected"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/kakao/kakaolink-no-logo-default.png";
                                }}
                              />
                            </div>
                          </div>
                          <p className="ml-1 text-[14px] font-normal">{shop_name}</p>
                        </div>
                        <div className="pt-[10px] text-[14px]">
                          <p style={{ letterSpacing: "-0.8px", lineHeight: "17px" }}>{title}</p>
                        </div>
                      </div>
                      <div className="px-[10px] text-[13px] opacity-50 break-words">
                        <p style={{ letterSpacing: "-0.3px", lineHeight: "17px" }}>{description}</p>
                      </div>
                      <div className="flex min-w-full flex-col items-center justify-end gap-0 pt-[10px]">
                        <button className="center mx-auto mb-1 h-[36px] w-[calc(100%-20px)] rounded-md bg-[#f1f2f4] text-[13px] focus:outline-none">
                          {button_name}
                        </button>
                        <div className="mt-1 box-border min-w-full cursor-pointer items-center justify-between bg-white py-[6px] px-[10px]">
                          <a
                            href="https://www.incento.kr"
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-w-full flex-row items-center justify-between"
                          >
                            <div className="flex select-none flex-row items-center gap-1">
                              <div className="h-[16px] w-[16px] border border-gray-300" style={{ borderRadius: "35%" }}>
                                <img
                                  className="h-full w-full"
                                  src={
                                    page_type === "DETAILS"
                                      ? `${baseUrl}${shop_logo}`
                                      : shop_logo_result || "/images/kakao/kakaolink-no-logo-default.png"
                                  }
                                  alt="Shop Logo"
                                  style={{ borderRadius: "35%" }}
                                />
                              </div>
                              <p className="text-gray-400 text-xs">{shop_name}</p>
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

          <div className="flex flex-col h-full w-full">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default KakaoShareTemplate;
