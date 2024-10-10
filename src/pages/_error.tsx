import React from "react";
import { NextPageContext } from "next";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage = ({ statusCode, message }: ErrorPageProps) => {
  const defaultMessage =
    statusCode === 404
      ? "앗! 페이지를 찾을 수가 없어요, 주소를 다시 한번 확인해 주세요."
      : "예상치 못한 오류가 발생했습니다.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 text-gray-700">
      <main className="text-center bg-gradient-to-b from-blue-200 to-blue-300 p-10 rounded-xl shadow-md">
        <h1 className="text-6xl font-bold">{statusCode || "오류"}</h1>
        <p className="mt-4 text-xl">{message || defaultMessage}</p>
        <p className="mt-4 text-lg">{statusCode ? `오류 코드: ${statusCode}` : "알 수 없는 오류"}</p>
        <a href="/" className="mt-8 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          홈으로 돌아가기
        </a>
      </main>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  const message = err?.message || null;

  return { statusCode, message };
};

export default ErrorPage;
