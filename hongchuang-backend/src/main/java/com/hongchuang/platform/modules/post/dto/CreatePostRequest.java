package com.hongchuang.platform.modules.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {
    @NotNull
    private Long boardId;

    @NotBlank
    @Size(min = 3, max = 150)
    private String title;

    @Size(max = 300)
    private String summary;

    @NotBlank
    private String contentMd;

    private List<Long> tagIds;
}
