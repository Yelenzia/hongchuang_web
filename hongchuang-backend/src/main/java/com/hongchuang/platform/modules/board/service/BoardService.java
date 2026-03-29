package com.hongchuang.platform.modules.board.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.modules.board.dto.BoardSaveRequest;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.mapper.ForumBoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final ForumBoardMapper forumBoardMapper;

    public List<ForumBoard> listPublicBoards() {
        return forumBoardMapper.selectList(new LambdaQueryWrapper<ForumBoard>()
                .eq(ForumBoard::getStatus, 1)
                .eq(ForumBoard::getIsPublic, 1)
                .orderByAsc(ForumBoard::getSortOrder));
    }

    public List<ForumBoard> listAllBoards() {
        return forumBoardMapper.selectList(new LambdaQueryWrapper<ForumBoard>()
                .orderByAsc(ForumBoard::getSortOrder));
    }

    public ForumBoard getById(Long boardId) {
        ForumBoard board = forumBoardMapper.selectById(boardId);
        if (board == null) {
            throw new BusinessException("板块不存在");
        }
        return board;
    }

    public Long create(BoardSaveRequest request) {
        if (forumBoardMapper.selectCount(new LambdaQueryWrapper<ForumBoard>().eq(ForumBoard::getSlug, request.getSlug())) > 0) {
            throw new BusinessException("板块标识已存在");
        }
        ForumBoard board = new ForumBoard();
        board.setName(request.getName());
        board.setSlug(request.getSlug());
        board.setDescription(request.getDescription());
        board.setIcon(request.getIcon());
        board.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        board.setPostCount(0);
        board.setIsPublic(request.getIsPublic() == null ? 1 : request.getIsPublic());
        board.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        forumBoardMapper.insert(board);
        return board.getId();
    }

    public void update(Long boardId, BoardSaveRequest request) {
        ForumBoard board = getById(boardId);
        board.setName(request.getName());
        board.setSlug(request.getSlug());
        board.setDescription(request.getDescription());
        board.setIcon(request.getIcon());
        board.setSortOrder(request.getSortOrder());
        board.setIsPublic(request.getIsPublic());
        board.setStatus(request.getStatus());
        forumBoardMapper.updateById(board);
    }

    public void delete(Long boardId) {
        forumBoardMapper.deleteById(boardId);
    }

    public void incrementPostCount(Long boardId, int delta) {
        ForumBoard board = forumBoardMapper.selectById(boardId);
        if (board == null) {
            return;
        }
        board.setPostCount(Math.max((board.getPostCount() == null ? 0 : board.getPostCount()) + delta, 0));
        forumBoardMapper.updateById(board);
    }
}
