package com.hongchuang.platform.modules.wallet.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.hongchuang.platform.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_wallet")
public class UserWallet extends BaseEntity {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long userId;
    private Integer diamond;
    private Integer goldIngot;
    private Integer ironIngot;
    private Integer copperIngot;
    private Integer totalCheckInDays;
    private Integer streakDays;
    private LocalDate lastCheckInDate;
}
