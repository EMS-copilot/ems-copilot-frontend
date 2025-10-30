import Image from "next/image";

export default function CapacityAndContacts() {
  const departments = [
    { name: "수술실 (OR)", count: 1, color: "#27A959" }, // Positive 900
    { name: "응급실 침상", count: 3, color: "#27A959" },
    { name: "중환자실 (ICU)", count: 3, color: "#FFA034" }, // Warning 500
    { name: "당직 전문의", count: 3, color: "#FFA034" },
  ];

  const contacts = [
    { name: "김현섭 응급전문의", phone: "010-4234-4234" },
    { name: "이수정 심리상담사", phone: "010-5678-9101" },
    { name: "박준형 외과의사", phone: "010-2345-6789" },
    { name: "최지은 내과의사", phone: "010-9876-5432" },
    { name: "한민재 정형외과의사", phone: "010-1111-2222" },
    { name: "서지훈 신경외과의사", phone: "010-3333-4444" },
  ];

  return (
    <div className="w-[514px] h-[452px] bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 font-['Pretendard']">
      {/* 병원 수용 능력 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <Image src="/Waiting.png" alt="병원 수용 능력" width={20} height={20} />
        <h2 className="text-lg font-semibold text-gray-900">병원 수용 능력</h2>
      </div>

      {/* 수용 능력 2줄 */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-4">
        {departments.map((dept, i) => (
          <div key={i} className="flex items-center justify-between w-[229px]">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: dept.color }}
              ></div>
              <span className="text-sm font-medium text-gray-800">{dept.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="number"
                defaultValue={dept.count}
                className="
                  w-[63px] h-[38px]
                  border border-gray-200 rounded-[10px]
                  text-sm font-medium text-gray-400
                  bg-white pl-2 text-left
                  focus:outline-none focus:ring-0
                  "
              />
              <span className="text-sm text-gray-700">개</span>
            </div>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div
        className="border-t border-gray-300 w-[466px] my-4"
        style={{ borderWidth: "1px" }}
      ></div>

      {/* 전문의 긴급 연락처 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <Image src="/Call.png" alt="긴급 연락처" width={16} height={16} />
        <h2 className="text-lg font-semibold text-gray-900">전문의 긴급 연락처</h2>
      </div>

      {/* 연락처 리스트 (세로 스크롤) */}
      <div className="w-[466px] h-[190px] overflow-y-auto overflow-x-hidden space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-[466px] h-[40px] bg-gray-100 rounded-[12px] px-3 py-2"
          >
            <span className="font-medium text-sm text-gray-800">{contact.name}</span>
            <span className="font-medium text-sm text-gray-700 font-mono">{contact.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
