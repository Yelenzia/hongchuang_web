package com.hongchuang.platform.modules.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hongchuang.platform.modules.system.entity.SysSequence;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

public interface SysSequenceMapper extends BaseMapper<SysSequence> {

    @Select("SELECT biz_key, `last_value` FROM sys_sequence WHERE biz_key = #{bizKey} FOR UPDATE")
    SysSequence selectForUpdate(@Param("bizKey") String bizKey);

    @Insert("INSERT IGNORE INTO sys_sequence (biz_key, `last_value`) VALUES (#{bizKey}, #{lastValue})")
    int insertIgnore(@Param("bizKey") String bizKey, @Param("lastValue") Long lastValue);

    @Update("UPDATE sys_sequence SET `last_value` = #{lastValue} WHERE biz_key = #{bizKey}")
    int updateLastValue(@Param("bizKey") String bizKey, @Param("lastValue") Long lastValue);
}
