package com.hongchuang.platform.modules.wallet.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hongchuang.platform.common.exception.BusinessException;
import com.hongchuang.platform.common.util.CurrentUserUtils;
import com.hongchuang.platform.modules.notification.service.NotificationService;
import com.hongchuang.platform.modules.user.entity.SysUserProfile;
import com.hongchuang.platform.modules.user.mapper.SysUserProfileMapper;
import com.hongchuang.platform.modules.wallet.entity.ShopExchangeRule;
import com.hongchuang.platform.modules.wallet.entity.UserCheckIn;
import com.hongchuang.platform.modules.wallet.entity.UserWallet;
import com.hongchuang.platform.modules.wallet.entity.UserWalletLog;
import com.hongchuang.platform.modules.wallet.mapper.ShopExchangeRuleMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserCheckInMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserWalletLogMapper;
import com.hongchuang.platform.modules.wallet.mapper.UserWalletMapper;
import com.hongchuang.platform.modules.wallet.vo.ShopExchangeRuleVO;
import com.hongchuang.platform.modules.wallet.vo.UserWalletVO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserWalletMapper userWalletMapper;
    private final UserWalletLogMapper userWalletLogMapper;
    private final UserCheckInMapper userCheckInMapper;
    private final ShopExchangeRuleMapper shopExchangeRuleMapper;
    private final SysUserProfileMapper sysUserProfileMapper;
    private final NotificationService notificationService;

    public UserWallet ensureWallet(Long userId) {
        UserWallet wallet = userWalletMapper.selectOne(new LambdaQueryWrapper<UserWallet>()
                .eq(UserWallet::getUserId, userId).last("limit 1"));
        if (wallet != null) return wallet;
        wallet = new UserWallet();
        wallet.setUserId(userId);
        wallet.setDiamond(0);
        wallet.setGoldIngot(0);
        wallet.setIronIngot(0);
        wallet.setCopperIngot(0);
        wallet.setTotalCheckInDays(0);
        wallet.setStreakDays(0);
        userWalletMapper.insert(wallet);
        return wallet;
    }

    public UserWalletVO myWallet() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        UserWallet wallet = ensureWallet(userId);
        return toVO(wallet);
    }

    public List<ShopExchangeRuleVO> rules() {
        return shopExchangeRuleMapper.selectList(new LambdaQueryWrapper<ShopExchangeRule>()
                        .eq(ShopExchangeRule::getStatus, 1)
                        .orderByAsc(ShopExchangeRule::getSortOrder)
                        .orderByAsc(ShopExchangeRule::getId))
                .stream()
                .map(item -> {
                    try {
                        return ShopExchangeRuleVO.builder()
                                .id(item.getId())
                                .code(item.getCode())
                                .name(item.getName())
                                .fromCurrency(normalizeCurrency(item.getFromCurrency()))
                                .fromAmount(item.getFromAmount())
                                .toCurrency(normalizeCurrency(item.getToCurrency()))
                                .toAmount(item.getToAmount())
                                .dailyLimit(item.getDailyLimit())
                                .status(item.getStatus())
                                .build();
                    } catch (BusinessException ex) {
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public UserWalletVO checkIn() {
        Long userId = CurrentUserUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();
        long exists = userCheckInMapper.selectCount(new LambdaQueryWrapper<UserCheckIn>()
                .eq(UserCheckIn::getUserId, userId)
                .eq(UserCheckIn::getCheckInDate, today));
        if (exists > 0) {
            throw new BusinessException("今天已经签到过了");
        }
        UserWallet wallet = ensureWallet(userId);
        int streak = wallet.getLastCheckInDate() != null && wallet.getLastCheckInDate().plusDays(1).equals(today)
                ? (wallet.getStreakDays() == null ? 0 : wallet.getStreakDays()) + 1 : 1;
        int reward = 10 + Math.min(streak - 1, 6) * 2;
        wallet.setCopperIngot((wallet.getCopperIngot() == null ? 0 : wallet.getCopperIngot()) + reward);
        wallet.setLastCheckInDate(today);
        wallet.setStreakDays(streak);
        wallet.setTotalCheckInDays((wallet.getTotalCheckInDays() == null ? 0 : wallet.getTotalCheckInDays()) + 1);
        userWalletMapper.updateById(wallet);

        UserCheckIn checkIn = new UserCheckIn();
        checkIn.setUserId(userId);
        checkIn.setCheckInDate(today);
        checkIn.setRewardCurrency("COPPER_INGOT");
        checkIn.setRewardAmount(reward);
        checkIn.setStreakDay(streak);
        userCheckInMapper.insert(checkIn);

        logChange(userId, "COPPER_INGOT", reward, wallet.getCopperIngot(), "CHECK_IN", "每日签到奖励", checkIn.getId());
        addExperience(userId, 6 + Math.min(streak, 7));
        notificationService.push(userId, "CHECK_IN", "签到成功", "你今日签到获得了 " + reward + " 铜锭。", checkIn.getId(), "CHECK_IN");
        return toVO(wallet);
    }

    @Transactional(rollbackFor = Exception.class)
    public UserWalletVO exchange(String code) {
        Long userId = CurrentUserUtils.getCurrentUserId();
        ShopExchangeRule rule = shopExchangeRuleMapper.selectOne(new LambdaQueryWrapper<ShopExchangeRule>()
                .eq(ShopExchangeRule::getCode, StringUtils.trimToEmpty(code).toUpperCase())
                .eq(ShopExchangeRule::getStatus, 1)
                .last("limit 1"));
        if (rule == null) {
            throw new BusinessException("兑换规则不存在");
        }

        String fromCurrency = normalizeCurrency(rule.getFromCurrency());
        String toCurrency = normalizeCurrency(rule.getToCurrency());
        if (fromCurrency.equals(toCurrency)) {
            throw new BusinessException("兑换规则配置错误：来源货币与目标货币不能相同");
        }

        UserWallet wallet = ensureWallet(userId);
        if (rule.getDailyLimit() != null && rule.getDailyLimit() > 0) {
            long used = userWalletLogMapper.selectCount(new LambdaQueryWrapper<UserWalletLog>()
                    .eq(UserWalletLog::getUserId, userId)
                    .eq(UserWalletLog::getBizType, "EXCHANGE_IN")
                    .eq(UserWalletLog::getRelatedId, rule.getId())
                    .between(UserWalletLog::getCreatedAt,
                            LocalDateTime.now().with(LocalTime.MIN),
                            LocalDateTime.now().with(LocalTime.MAX)));
            if (used >= rule.getDailyLimit()) {
                throw new BusinessException("该兑换规则今日已达到上限");
            }
        }

        int fromBalance = balance(wallet, fromCurrency);
        if (fromBalance < rule.getFromAmount()) {
            throw new BusinessException("余额不足，无法兑换");
        }
        int newFromBalance = fromBalance - rule.getFromAmount();
        int currentToBalance = balance(wallet, toCurrency);
        int newToBalance = currentToBalance + rule.getToAmount();

        setBalance(wallet, fromCurrency, newFromBalance);
        setBalance(wallet, toCurrency, newToBalance);
        userWalletMapper.updateById(wallet);

        UserWallet updatedWallet = userWalletMapper.selectById(wallet.getId());
        if (updatedWallet == null) {
            updatedWallet = wallet;
        }

        logChange(userId, fromCurrency, -rule.getFromAmount(), balance(updatedWallet, fromCurrency), "EXCHANGE_OUT", rule.getName(), rule.getId());
        logChange(userId, toCurrency, rule.getToAmount(), balance(updatedWallet, toCurrency), "EXCHANGE_IN", rule.getName(), rule.getId());
        notificationService.push(userId, "SHOP", "兑换成功", "已完成兑换：" + rule.getName(), rule.getId(), "SHOP_RULE");
        return toVO(updatedWallet);
    }

    @Transactional(rollbackFor = Exception.class)
    public void addExperience(Long userId, int delta) {
        if (userId == null || delta <= 0) return;
        SysUserProfile profile = sysUserProfileMapper.selectOne(new LambdaQueryWrapper<SysUserProfile>()
                .eq(SysUserProfile::getUserId, userId).last("limit 1"));
        if (profile == null) return;
        int exp = profile.getExperiencePoints() == null ? 0 : profile.getExperiencePoints();
        exp += delta;
        profile.setExperiencePoints(exp);
        profile.setUserLevel(resolveLevel(exp));
        sysUserProfileMapper.updateById(profile);
    }

    public static int resolveLevel(int exp) {
        int[] thresholds = {0, 0, 20, 60, 120, 220, 360, 560, 820, 1160};
        int level = 1;
        for (int i = 1; i <= 9; i++) {
            if (exp >= thresholds[i]) level = i;
        }
        return level;
    }

    public static int nextLevelExp(int exp) {
        int level = resolveLevel(exp);
        if (level >= 9) return 0;
        int[] thresholds = {0, 0, 20, 60, 120, 220, 360, 560, 820, 1160};
        return thresholds[level + 1];
    }

    private UserWalletVO toVO(UserWallet wallet) {
        LocalDate today = LocalDate.now();
        return UserWalletVO.builder()
                .diamond(wallet.getDiamond() == null ? 0 : wallet.getDiamond())
                .goldIngot(wallet.getGoldIngot() == null ? 0 : wallet.getGoldIngot())
                .ironIngot(wallet.getIronIngot() == null ? 0 : wallet.getIronIngot())
                .copperIngot(wallet.getCopperIngot() == null ? 0 : wallet.getCopperIngot())
                .totalCheckInDays(wallet.getTotalCheckInDays() == null ? 0 : wallet.getTotalCheckInDays())
                .streakDays(wallet.getStreakDays() == null ? 0 : wallet.getStreakDays())
                .lastCheckInDate(wallet.getLastCheckInDate())
                .checkedInToday(wallet.getLastCheckInDate() != null && wallet.getLastCheckInDate().equals(today))
                .build();
    }

    int balance(UserWallet wallet, String currency) {
        String normalized = normalizeCurrency(currency);
        return switch (normalized) {
            case "DIAMOND" -> wallet.getDiamond() == null ? 0 : wallet.getDiamond();
            case "GOLD_INGOT" -> wallet.getGoldIngot() == null ? 0 : wallet.getGoldIngot();
            case "IRON_INGOT" -> wallet.getIronIngot() == null ? 0 : wallet.getIronIngot();
            case "COPPER_INGOT" -> wallet.getCopperIngot() == null ? 0 : wallet.getCopperIngot();
            default -> throw new BusinessException("不支持的货币类型：" + currency);
        };
    }

    void setBalance(UserWallet wallet, String currency, int value) {
        String normalized = normalizeCurrency(currency);
        switch (normalized) {
            case "DIAMOND" -> wallet.setDiamond(Math.max(value, 0));
            case "GOLD_INGOT" -> wallet.setGoldIngot(Math.max(value, 0));
            case "IRON_INGOT" -> wallet.setIronIngot(Math.max(value, 0));
            case "COPPER_INGOT" -> wallet.setCopperIngot(Math.max(value, 0));
            default -> throw new BusinessException("不支持的货币类型：" + currency);
        }
    }

    void logChange(Long userId, String currency, int changeAmount, int balanceAfter, String bizType, String remark, Long relatedId) {
        UserWalletLog log = new UserWalletLog();
        log.setUserId(userId);
        log.setCurrencyType(normalizeCurrency(currency));
        log.setChangeAmount(changeAmount);
        log.setBalanceAfter(balanceAfter);
        log.setBizType(bizType);
        log.setRemark(remark);
        log.setRelatedId(relatedId);
        userWalletLogMapper.insert(log);
    }

    private String normalizeCurrency(String currency) {
        String normalized = StringUtils.trimToEmpty(currency).toUpperCase();
        return switch (normalized) {
            case "DIAMOND", "GOLD_INGOT", "IRON_INGOT", "COPPER_INGOT" -> normalized;
            default -> throw new BusinessException("不支持的货币类型：" + currency);
        };
    }
}
