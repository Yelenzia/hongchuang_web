package com.hongchuang.platform.modules.admin.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.board.dto.BoardSaveRequest;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/boards")
public class AdminBoardController {

    private final BoardService boardService;

    public AdminBoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public Result<List<ForumBoard>> list() {
        return Result.success(boardService.listAllBoards());
    }

    @PostMapping
    public Result<?> create(@Valid @RequestBody BoardSaveRequest request) {
        return Result.success("创建成功", Map.of("boardId", boardService.create(request)));
    }

    @PutMapping("/{boardId}")
    public Result<Void> update(@PathVariable Long boardId, @Valid @RequestBody BoardSaveRequest request) {
        boardService.update(boardId, request);
        return Result.success("更新成功", null);
    }

    @DeleteMapping("/{boardId}")
    public Result<Void> delete(@PathVariable Long boardId) {
        boardService.delete(boardId);
        return Result.success("删除成功", null);
    }
}
