package com.hongchuang.platform.modules.board.controller;

import com.hongchuang.platform.common.api.Result;
import com.hongchuang.platform.modules.board.entity.ForumBoard;
import com.hongchuang.platform.modules.board.service.BoardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public Result<List<ForumBoard>> list() {
        return Result.success(boardService.listPublicBoards());
    }
}
