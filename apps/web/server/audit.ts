import { AuditLog, AuditAction } from '@/lib/types';

// 메모리 저장소 (프로덕션에서는 DB/WORM 스토리지로 교체)
const auditLogs: AuditLog[] = [];

export async function logAudit(event: {
  userId: string;
  action: AuditAction;
  resource: string;
  details?: any;
}): Promise {
  const log: AuditLog = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // 메모리에 저장
  auditLogs.push(log);

  // 콘솔 로깅
  console.log('[AUDIT]', JSON.stringify(log, null, 2));

  // TODO: 프로덕션 환경에서는 다음과 같이 구현
  // - PostgreSQL/MongoDB 등 DB에 저장
  // - AWS S3 Glacier 같은 WORM 스토리지에 백업
  // - Elasticsearch/Splunk 등으로 실시간 분석
  // - 규정 준수를 위한 암호화 및 무결성 검증
  
  // await db.auditLogs.insert(log);
  // await s3.putObject({ Bucket: 'audit-logs', Key: `${log.timestamp}-${log.userId}`, Body: JSON.stringify(log) });
}

export async function getAuditLogs(
  filter?: { userId?: string; action?: AuditAction; startDate?: string; endDate?: string }
): Promise {
  let logs = [...auditLogs];

  if (filter?.userId) {
    logs = logs.filter(log => log.userId === filter.userId);
  }
  if (filter?.action) {
    logs = logs.filter(log => log.action === filter.action);
  }
  if (filter?.startDate) {
    logs = logs.filter(log => log.timestamp >= filter.startDate);
  }
  if (filter?.endDate) {
    logs = logs.filter(log => log.timestamp <= filter.endDate);
  }

  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}