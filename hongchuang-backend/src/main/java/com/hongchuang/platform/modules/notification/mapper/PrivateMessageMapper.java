package com.hongchuang.platform.modules.notification.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hongchuang.platform.modules.notification.entity.PrivateMessage;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface PrivateMessageMapper extends BaseMapper<PrivateMessage> {

    @Select("""
            <script>
            SELECT id, from_user_id, to_user_id, content, is_read, created_at, updated_at, deleted
            FROM private_message
            WHERE deleted = 0
              AND ((from_user_id = #{userId} AND to_user_id = #{targetUserId})
                OR (from_user_id = #{targetUserId} AND to_user_id = #{userId}))
            ORDER BY created_at ASC
            LIMIT 200
            </script>
            """)
    List<PrivateMessage> selectConversation(@Param("userId") Long userId,
                                            @Param("targetUserId") Long targetUserId);
}
