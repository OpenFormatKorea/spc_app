import InputTextBox from "@/components/base/InputText";
import { KakaoShareArgs } from "@/lib/item/types";
import React, { useEffect, useRef, useState } from "react";
interface KakaoShareProps {
  page_type: string;
  disableInput: boolean;
  kakaoShareArgs: KakaoShareArgs;
  setKakaoShareArgs: (kakaoShareArgs: KakaoShareArgs) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const KakaoShareTemplate: React.FC<KakaoShareProps> = ({
  page_type,
  disableInput,
  kakaoShareArgs,
  setKakaoShareArgs,
  handleKeyDown,
}) => {
  const inputFormClass = "inputForm flex flex-col text-left w-full pb-4";
  const labelClass = "text-xs pt-4 text-gray-500";

  const [shop_name, setShop_name] = useState(kakaoShareArgs.shop_name);
  const [title, setTitle] = useState(kakaoShareArgs.title);
  const [description, setDescription] = useState(kakaoShareArgs.description);
  const [button_name, setButton_name] = useState(kakaoShareArgs.button_name);
  const [image, setImage] = useState<string>(kakaoShareArgs.image);
  const imageFileInput = useRef<HTMLInputElement | null>(null);
  const [shop_logo, setShop_logo] = useState<string>(kakaoShareArgs.shop_logo);
  const shopLogoFileInput = useRef<HTMLInputElement | null>(null);

  const onChangeImage = (imgType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && typeof reader.result === "string" && imgType === "image") {
          setImage(reader.result);
        } else if (reader.readyState === 2 && typeof reader.result === "string" && imgType === "shop_logo") {
          setShop_logo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (page_type === "NEW") {
      disableInput == false;
    } else {
      disableInput == true;
    }
  }, [page_type]);

  useEffect(() => {
    setKakaoShareArgs({
      shop_name: shop_name,
      title: title,
      description: description,
      button_name: button_name,
      image: image,
      shop_logo: shop_logo,
    });
    console.log("kakaoShareArgs", kakaoShareArgs);
  }, [shop_name, title, description, button_name, image, shop_logo]);

  return (
    <>
      <div className="contents-container w-full pt-4">
        <label className=" pt-4 font-bold text-gray-500">카카오 메시지 설정</label>
        <div className="block lg:flex lg:gap-4">
          <div className="w-full lg:w-fit flex items-center lg:items-start justify-center lg:justify-start">
            <div className="relative mt-4">
              <div className="w-[320px] mx-auto">
                <img src={"/images/kakao/kakao-message-template.png"} alt="Phone Mockup" />
              </div>
              <div className="absolute top-[90px] left-[45px]">
                <div className="flex h-full max-w-[238px] flex-col items-center justify-center rounded-lg bg-white shadow-card_shadow">
                  <div className=" min-h-full min-w-full overflow-hidden rounded-lg">
                    <div className="h-[238px] w-[238px] cursor-pointer">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        accept="image/jpg,image/png,image/jpeg"
                        name="image"
                        onChange={onChangeImage("image")}
                        ref={imageFileInput}
                        disabled={disableInput}
                      />
                      <div
                        className="relative h-full w-full flex items-center justify-center group"
                        onClick={() => {
                          imageFileInput.current?.click();
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            사진 업로드
                          </span>
                        </div>
                        <img className="h-full w-full " src={image} alt="Selected" />
                      </div>
                    </div>
                    <div className="box-border flex h-[calc(100%-460px)] min-w-full flex-col  items-start justify-between">
                      <div className="mb-2 flex min-w-full flex-col justify-start px-[10px]">
                        <div className="flex flex-row items-center justify-start border-b  border-gray-100 py-[10px]">
                          <div className="h-[23px] w-[23px] rounded-[8px] border border-gray-300 cursor-pointer">
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="image/jpg,image/png,image/jpeg"
                              name="shop_logo"
                              onChange={onChangeImage("shop_logo")}
                              ref={shopLogoFileInput}
                              disabled={disableInput}
                            />
                            <div
                              className="relative h-full w-full flex items-center justify-center group"
                              onClick={() => {
                                shopLogoFileInput.current?.click();
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                  className="h-full w-full rounded-[8px] bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 "
                                  src={shop_logo}
                                  alt="Selected"
                                />
                              </div>
                            </div>
                          </div>

                          <p className="ml-1 text-[14px] font-normal">{shop_name}</p>
                        </div>
                        <div className="pt-[10px] text-[14px]">
                          <p style={{ letterSpacing: "-0.8px", lineHeight: "17px" }}>{title}</p>
                        </div>
                      </div>
                      <div className="px-[10px] text-[13px] opacity-50">
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
                                <img className="h-full w-full " src={shop_logo} style={{ borderRadius: "35%" }} />
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
          <div className="flex flex-col h-full w-full ">
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
