package com.hongchuang.platform.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sys_sequence")
public class SysSequence {

    @TableId
    private String bizKey;

    private Long lastValue;
}
