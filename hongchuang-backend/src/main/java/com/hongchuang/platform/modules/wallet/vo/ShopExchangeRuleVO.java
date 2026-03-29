package com.hongchuang.platform.modules.wallet.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShopExchangeRuleVO {
    private Long id;
    private String code;
    private String name;
    private String fromCurrency;
    private Integer fromAmount;
    private String toCurrency;
    private Integer toAmount;
    private Integer dailyLimit;
    private Integer status;
}
