import request from '@/utils/request';
export const getReportListApi = (params) => request.get('/admin/reports', { params });
export const handleReportApi = (reportId, data) => request.patch(`/admin/reports/${reportId}/handle`, data);
//# sourceMappingURL=reports.js.map