"use client";

export default function OngoingCases() {
  const cases = [
    {
      id: "P2024-001",
      type: "위급",
      symptom: "흉통",
      time: "14시 32분",
      address: "강남구 테헤란로 427",
      hospital: "충북대학교 병원",
      status: "이송 중",
      color: "from-[#007AFF] to-[#0051FF]",
    },
    {
      id: "P2024-002",
      type: "위급",
      symptom: "흉통",
      time: "14시 32분",
      address: "강남구 테헤란로 427",
      hospital: "충북대학교 병원",
      status: "이송 완료",
      color: "from-[#666666] to-[#999999]",
    },
  ];

  return (
    <section className="px-4">
      {/* 섹션 제목 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-gray-900">진행중인 사건</h2>
        <span className="text-gray-400 text-[13px]">총 {cases.length}건</span>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-3">
        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2"
          >
            {/* 상단 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF4545] text-white text-[12px] px-2 py-[2px] rounded-md font-medium">
                  {c.type}
                </span>
                <span className="text-[15px] font-semibold text-gray-900">
                  {c.id} | {c.symptom}
                </span>
              </div>

              {/* 우측 화살표 */}
              <button className="text-gray-400 text-[18px]">›</button>
            </div>

            {/* 시작 시간 / 위치 */}
            <div className="flex items-center gap-2 text-[13px] text-gray-400">
              <span>🕓 시작 : {c.time}</span>
              <span>📍 {c.address}</span>
            </div>

            {/* 하단 병원 배너 */}
            <div
              className={`flex justify-between items-center rounded-full px-4 py-[6px] mt-1 text-white bg-gradient-to-r ${c.color}`}
            >
              <span className="text-[14px] font-semibold">{c.hospital}</span>
              <span className="bg-white text-gray-900 text-[13px] px-3 py-[2px] rounded-full font-medium">
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
