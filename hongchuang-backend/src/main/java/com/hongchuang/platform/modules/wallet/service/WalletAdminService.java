package com.hongchuang.platform.modules.wallet.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.SanitizeUtils;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.user.entity.SysUser;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserMapper;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.wallet.dto.AdminWalletAdjustRequest;
import com.hongchuang.platform.modules.wallet.dto.AdminWalletRuleSaveRequest;
import com.hongchuang.platform.modules.wallet.entity.ShopExchangeRule;
import com.hongchuang.platform.modules.wallet.entity.UserCheckIn;
import com.hongchuang.platform.modules.wallet.entity.UserWallet;
import com.hongchuang.platform.modules.wallet.entity.UserWalletLog;
import com.hongchuang.platform.modules.wallet.mapper.ShopExchangeRuleMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserCheckInMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserWalletLogMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserWalletMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class WalletAdminService {

    private final UserWalletMapper userWalletMapper;
    private final UserWalletLogMapper userWalletLogMapper;
    private final UserCheckInMapper userCheckInMapper;
    private final ShopExchangeRuleMapper shopExchangeRuleMapper;
    private final SysUserMapper sysUserMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final NotificationService notificationService;
    private final WalletService walletService;

    public Map<String, Object> overview() {
        List<UserWallet> wallets = userWalletMapper.selectList(new LambdaQueryWrapper<UserWallet>()
                .select(UserWallet::getId, UserWallet::getDiamond, UserWallet::getGoldIngot, UserWallet::getIronIngot, UserWallet::getCopperIngot));
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("walletUserCount", wallets.size());
        result.put("todayCheckInCount", userCheckInMapper.selectCount(new LambdaQueryWrapper<UserCheckIn>()
                .between(UserCheckIn::getCreatedAt, LocalDateTime.now().with(LocalTime.MIN), LocalDateTime.now().with(LocalTime.MAX))));
        result.put("todayExchangeCount", userWalletLogMapper.selectCount(new LambdaQueryWrapper<UserWalletLog>()
                .eq(UserWalletLog::getBizType, "EXCHANGE_IN")
                .between(UserWalletLog::getCreatedAt, LocalDateTime.now().with(LocalTime.MIN), LocalDateTime.now().with(LocalTime.MAX))));
        result.put("totalDiamond", wallets.stream().map(UserWallet::getDiamond).filter(Objects::nonNull).reduce(0, Integer::sum));
        result.put("totalGoldIngot", wallets.stream().map(UserWallet::getGoldIngot).filter(Objects::nonNull).reduce(0, Integer::sum));
        result.put("totalIronIngot", wallets.stream().map(UserWallet::getIronIngot).filter(Objects::nonNull).reduce(0, Integer::sum));
        result.put("totalCopperIngot", wallets.stream().map(UserWallet::getCopperIngot).filter(Objects::nonNull).reduce(0, Integer::sum));
        result.put("enabledRuleCount", shopExchangeRuleMapper.selectCount(new LambdaQueryWrapper<ShopExchangeRule>().eq(ShopExchangeRule::getStatus, 1)));
        return result;
    }

    public Page<ShopExchangeRule> pageRules(long pageNo, long pageSize, String keyword, Integer status) {
        LambdaQueryWrapper<ShopExchangeRule> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(keyword)) {
            String value = keyword.trim();
            wrapper.and(w -> w.like(ShopExchangeRule::getCode, value).or().like(ShopExchangeRule::getName, value));
        }
        if (status != null) {
            wrapper.eq(ShopExchangeRule::getStatus, status);
        }
        wrapper.orderByAsc(ShopExchangeRule::getSortOrder).orderByAsc(ShopExchangeRule::getId);
        return shopExchangeRuleMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long createRule(AdminWalletRuleSaveRequest request) {
        validateRule(request, null);
        ShopExchangeRule rule = new ShopExchangeRule();
        apply(rule, request);
        shopExchangeRuleMapper.insert(rule);
        return rule.getId();
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateRule(Long id, AdminWalletRuleSaveRequest request) {
        ShopExchangeRule rule = requireRule(id);
        validateRule(request, id);
        apply(rule, request);
        shopExchangeRuleMapper.updateById(rule);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateRuleStatus(Long id, Integer status) {
        ShopExchangeRule rule = requireRule(id);
        rule.setStatus(status == null || status != 1 ? 0 : 1);
        shopExchangeRuleMapper.updateById(rule);
    }

    public Page<Map<String, Object>> pageLogs(long pageNo, long pageSize, Long userId, String keyword, String currencyType, String bizType) {
        LambdaQueryWrapper<UserWalletLog> wrapper = new LambdaQueryWrapper<>();
        if (userId != null) {
            wrapper.eq(UserWalletLog::getUserId, userId);
        }
        if (StringUtils.isNotBlank(currencyType)) {
            wrapper.eq(UserWalletLog::getCurrencyType, currencyType.trim().toUpperCase());
        }
        if (StringUtils.isNotBlank(bizType)) {
            wrapper.eq(UserWalletLog::getBizType, bizType.trim().toUpperCase());
        }
        wrapper.orderByDesc(UserWalletLog::getCreatedAt);
        Page<UserWalletLog> page = userWalletLogMapper.selectPage(Page.of(pageNo, pageSize), wrapper);
        Page<Map<String, Object>> result = new Page<>(page.getCurrent(), page.getSize(), page.getTotal());
        String text = StringUtils.trimToEmpty(keyword);
        List<Map<String, Object>> rows = page.getRecords().stream()
                .map(this::toLogRow)
                .filter(row -> StringUtils.isBlank(text)
                        || String.valueOf(row.get("username")).contains(text)
                        || String.valueOf(row.get("nickname")).contains(text)
                        || String.valueOf(row.get("remark")).contains(text))
                .toList();
        result.setRecords(rows);
        result.setTotal(StringUtils.isBlank(text) ? page.getTotal() : rows.size());
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> manualAdjust(AdminWalletAdjustRequest request) {
        SysUser user = requireUser(request.getUserId());
        UserWallet wallet = walletService.ensureWallet(user.getId());
        String currency = normalizeCurrency(request.getCurrencyType());
        int before = walletService.balance(wallet, currency);
        int after = before + request.getChangeAmount();
        if (after < 0) {
            throw new BusinessException("调整后余额不能小于0");
        }
        walletService.setBalance(wallet, currency, after);
        userWalletMapper.updateById(wallet);
        String remark = SanitizeUtils.cleanText(request.getRemark());
        walletService.logChange(user.getId(), currency, request.getChangeAmount(), after, "MANUAL", remark, null);
        notificationService.push(user.getId(), "WALLET_MANUAL", "钱包余额变动", "管理员已调整你的" + currencyLabel(currency) + "余额：" + (request.getChangeAmount() > 0 ? "+" : "") + request.getChangeAmount() + "。备注：" + remark, user.getId(), "USER");
        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());
        result.put("currencyType", currency);
        result.put("beforeBalance", before);
        result.put("afterBalance", after);
        return result;
    }

    public Map<String, Object> walletDetail(Long userId) {
        SysUser user = requireUser(userId);
        SysUserProfile profile = profileOf(userId);
        UserWallet wallet = walletService.ensureWallet(userId);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("userId", user.getId());
        map.put("username", user.getUsername());
        map.put("nickname", profile == null ? user.getUsername() : profile.getNickname());
        map.put("diamond", wallet.getDiamond() == null ? 0 : wallet.getDiamond());
        map.put("goldIngot", wallet.getGoldIngot() == null ? 0 : wallet.getGoldIngot());
        map.put("ironIngot", wallet.getIronIngot() == null ? 0 : wallet.getIronIngot());
        map.put("copperIngot", wallet.getCopperIngot() == null ? 0 : wallet.getCopperIngot());
        map.put("streakDays", wallet.getStreakDays() == null ? 0 : wallet.getStreakDays());
        map.put("totalCheckInDays", wallet.getTotalCheckInDays() == null ? 0 : wallet.getTotalCheckInDays());
        map.put("lastCheckInDate", wallet.getLastCheckInDate());
        return map;
    }

    private void validateRule(AdminWalletRuleSaveRequest request, Long id) {
        String code = request.getCode().trim().toUpperCase();
        long exists = shopExchangeRuleMapper.selectCount(new LambdaQueryWrapper<ShopExchangeRule>()
                .eq(ShopExchangeRule::getCode, code)
                .ne(id != null, ShopExchangeRule::getId, id));
        if (exists > 0) {
            throw new BusinessException("兑换规则编码已存在");
        }
        if (request.getFromAmount() == null || request.getFromAmount() <= 0 || request.getToAmount() == null || request.getToAmount() <= 0) {
            throw new BusinessException("兑换数量必须大于0");
        }
        if (normalizeCurrency(request.getFromCurrency()).equals(normalizeCurrency(request.getToCurrency()))) {
            throw new BusinessException("兑换前后货币不能相同");
        }
    }

    private void apply(ShopExchangeRule rule, AdminWalletRuleSaveRequest request) {
        rule.setCode(request.getCode().trim().toUpperCase());
        rule.setName(SanitizeUtils.cleanText(request.getName()));
        rule.setFromCurrency(normalizeCurrency(request.getFromCurrency()));
        rule.setFromAmount(request.getFromAmount());
        rule.setToCurrency(normalizeCurrency(request.getToCurrency()));
        rule.setToAmount(request.getToAmount());
        rule.setDailyLimit(request.getDailyLimit() == null ? 0 : Math.max(request.getDailyLimit(), 0));
        rule.setStatus(request.getStatus() == null || request.getStatus() != 0 ? 1 : 0);
        rule.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
    }

    private ShopExchangeRule requireRule(Long id) {
        ShopExchangeRule rule = shopExchangeRuleMapper.selectById(id);
        if (rule == null) {
            throw new BusinessException("兑换规则不存在");
        }
        return rule;
    }

    private SysUser requireUser(Long userId) {
        SysUser user = sysUserMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return user;
    }

    private SysUserProfile profileOf(Long userId) {
        return sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId)
                .last("limit 1"));
    }

    private Map<String, Object> toLogRow(UserWalletLog log) {
        SysUser user = sysUserMapper.selectById(log.getUserId());
        SysUserProfile profile = profileOf(log.getUserId());
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", log.getId());
        row.put("userId", log.getUserId());
        row.put("username", user == null ? null : user.getUsername());
        row.put("nickname", profile == null ? null : profile.getNickname());
        row.put("currencyType", log.getCurrencyType());
        row.put("changeAmount", log.getChangeAmount());
        row.put("balanceAfter", log.getBalanceAfter());
        row.put("bizType", log.getBizType());
        row.put("remark", log.getRemark());
        row.put("relatedId", log.getRelatedId());
        row.put("createdAt", log.getCreatedAt());
        return row;
    }

    private String normalizeCurrency(String currency) {
        if (StringUtils.isBlank(currency)) {
            throw new BusinessException("货币类型不能为空");
        }
        String value = currency.trim().toUpperCase();
        if (!List.of("DIAMOND", "GOLD_INGOT", "IRON_INGOT", "COPPER_INGOT").contains(value)) {
            throw new BusinessException("不支持的货币类型");
        }
        return value;
    }

    private String currencyLabel(String currency) {
        return switch (currency) {
            case "DIAMOND" -> "钻石";
            case "GOLD_INGOT" -> "金锭";
            case "IRON_INGOT" -> "铁锭";
            default -> "铜锭";
        };
    }
}
