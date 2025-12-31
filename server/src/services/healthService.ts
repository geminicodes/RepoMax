export type ServiceHealthSnapshot = {
  ok: boolean;
  timestamp: string;
  services: Record<string, { ok: boolean; details?: Record<string, unknown> }>;
};
 
export async function getServiceHealthSnapshot(): Promise<ServiceHealthSnapshot> {
  return {
    ok: true,
    timestamp: new Date().toISOString(),
    services: {
      api: { ok: true }
    }
  };
}
