package com.hongchuang.platform.modules.wallet.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("shop_exchange_rule")
public class ShopExchangeRule extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String code;
    private String name;
    private String fromCurrency;
    private Integer fromAmount;
    private String toCurrency;
    private Integer toAmount;
    private Integer dailyLimit;
    private Integer status;
    private Integer sortOrder;
}
