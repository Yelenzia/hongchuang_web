package com.hongchuang.platform.modules.wallet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminWalletRuleSaveRequest {
    @NotBlank
    @Size(max = 32)
    private String code;

    @NotBlank
    @Size(max = 80)
    private String name;

    @NotBlank
    @Size(max = 32)
    private String fromCurrency;

    @NotNull
    private Integer fromAmount;

    @NotBlank
    @Size(max = 32)
    private String toCurrency;

    @NotNull
    private Integer toAmount;

    private Integer dailyLimit;
    private Integer status;
    private Integer sortOrder;
}
