package com.hongchuang.platform.modules.wallet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminWalletAdjustRequest {
    @NotNull
    private Long userId;

    @NotBlank
    @Size(max = 32)
    private String currencyType;

    @NotNull
    private Integer changeAmount;

    @NotBlank
    @Size(max = 200)
    private String remark;
}
