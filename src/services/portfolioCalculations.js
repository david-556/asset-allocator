"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalValue = totalValue;
exports.allocationByType = allocationByType;
exports.driftFromTarget = driftFromTarget;
exports.calculateInvestmentDistribution = calculateInvestmentDistribution;
exports.percentageByType = percentageByType;
/**
 * Calulcates total portfolio value
 */
function totalValue(assets) {
    return assets.reduce(function (sum, a) { return sum + a.value; }, 0);
}
/**
 * groups the portfolio value by asset type
 */
function allocationByType(assets) {
    var result = {};
    assets.forEach(function (a) {
        result[a.type] = (result[a.type] || 0) + a.value;
    });
    return result;
}
/**
 * Calculates drift from one asset
 */
function driftFromTarget(current, targets) {
    var result = [];
    targets.forEach(function (t) {
        var currentPercent = current[t.assetType] || 0;
        var drift = currentPercent - t.percent;
        result.push({
            type: t.assetType,
            current: currentPercent,
            target: t.percent,
            drift: drift
        });
    });
    return result;
}
function calculateInvestmentDistribution(amount, currentValuesByType, targets) {
    var total = Object.keys(currentValuesByType).reduce(function (s, key) { return s + currentValuesByType[key]; }, 0);
    //if portfolio is empty, just split by target % 
    if (total <= 0) {
        return targets.map(function (t) { return ({
            type: t.assetType,
            amount: round2((amount * t.percent) / 100)
        }); });
    }
    //How much each type "should" have after investing amount
    var desiredTotal = total + amount;
    var gaps = targets.map(function (t) {
        var current = currentValuesByType[t.assetType] || 0;
        var desired = (desiredTotal * t.percent) / 100;
        var gap = Math.max(0, desired - current); // only invest into underweight categories 
        return { type: t.assetType, gap: gap };
    });
    var totalGap = gaps.reduce(function (s, g) { return s + g.gap; }, 0);
    //If nothing is underweight (or rounding), then fallback to target split 
    if (totalGap <= 0) {
        return targets.map(function (t) { return ({
            type: t.assetType,
            amount: round2((amount * t.percent) / 100)
        }); });
    }
    // Distribute amount proportionally to gaps
    var distribution = gaps.map(function (g) { return ({
        type: g.type,
        amount: round2((amount * g.gap) / totalGap)
    }); });
    //Fix rounding so amounts sum exactly to 'amount' (in cents)
    distribution = fixRounding(distribution, amount);
    return distribution;
}
//function for the dashboard
function percentageByType(assets) {
    var values = allocationByType(assets);
    var total = totalValue(assets);
    var result = {};
    for (var key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
            var value = values[key];
            result[key] = (value / total) * 100;
        }
    }
    return result;
}
function fixRounding(items, total) {
    var toCents = function (x) { return Math.round(x * 100); };
    var fromCents = function (x) { return x / 100; };
    var targetCents = toCents(total);
    var sumCents = items.reduce(function (s, i) { return s + toCents(i.amount); }, 0);
    var diff = targetCents - sumCents;
    if (diff == 0)
        return items;
    //Add/subtract the diff to the largest allocation (simple + stable)
    var maxIdx = 0;
    for (var i = 1; i < items.length; i++) {
        if (items[i].amount > items[maxIdx].amount)
            maxIdx = i;
    }
    var updated = __spreadArray([], items, true);
    updated[maxIdx] = __assign(__assign({}, updated[maxIdx]), { amount: fromCents(toCents(updated[maxIdx].amount) + diff) });
    return updated;
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
