package com.hongchuang.platform.modules.wallet.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UserWalletVO {
    private Integer diamond;
    private Integer goldIngot;
    private Integer ironIngot;
    private Integer copperIngot;
    private Integer totalCheckInDays;
    private Integer streakDays;
    private LocalDate lastCheckInDate;
    private Boolean checkedInToday;
}
