import request from '@/utils/request';
export const getBoardListApi = () => request.get('/admin/boards');
export const createBoardApi = (data) => request.post('/admin/boards', data);
export const updateBoardApi = (boardId, data) => request.put(`/admin/boards/${boardId}`, data);
export const deleteBoardApi = (boardId) => request.delete(`/admin/boards/${boardId}`);
//# sourceMappingURL=boards.js.map