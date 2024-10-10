import * as React from "react";

export default function NotFoundPage() {
  return (
    <div className="AuthContainer flex w-full justify-center items-center text-center h-screen bg-gradient-to-b from-blue-200 to-blue-300 ">
      <main>
        <div className="min-w-[380px] min-h-[380px] rounded-xl p-6 bg-gradient-to-b from-gray-200 to-gray-300 flex flex-col justify-center items-center text-center">
          <div className="flex flex-col w-full items-start justify-between">
            <h1 className="mt-8 text-2xl font-bold text-center w-full text-gray-500">
              앗! 페이지를 찾을 수가 없어요,
              <br />
              주소를 다시 한번 확인해 주세요.
              <br />
              =)
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
}
