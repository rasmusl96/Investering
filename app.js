"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _React = React,
  useState = _React.useState,
  useMemo = _React.useMemo;
var _Recharts = Recharts,
  AreaChart = _Recharts.AreaChart,
  Area = _Recharts.Area,
  XAxis = _Recharts.XAxis,
  YAxis = _Recharts.YAxis,
  CartesianGrid = _Recharts.CartesianGrid,
  Tooltip = _Recharts.Tooltip,
  ResponsiveContainer = _Recharts.ResponsiveContainer,
  ReferenceLine = _Recharts.ReferenceLine;
var HORIZONS = [5, 10, 15, 20];
var ASK_TAX = 0.17;
var FREE_TAX_LOW = 0.27;
var FREE_TAX_HIGH = 0.42;
var FREE_TAX_THRESHOLD = 61000;
function formatDKK(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(2).replace(".", ",") + " mio.";
  return Math.round(val).toLocaleString("da-DK") + " kr.";
}
function formatDKKShort(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1).replace(".", ",") + "M";
  if (val >= 1000) return (val / 1000).toFixed(0) + "K";
  return Math.round(val).toString();
}
function simulate(startAmount, monthlyContrib, annualReturn, years, loft) {
  var mr = Math.pow(1 + annualReturn, 1 / 12) - 1;
  var askValue = Math.min(startAmount, loft);
  var askYearStart = askValue;
  var askTotalIn = askValue;
  var freeValue = Math.max(0, startAmount - loft);
  var freeYearStart = freeValue;
  var freeTotalIn = freeValue;
  var freeCarryLoss = 0;
  var loftHitYear = null;
  var yearlyData = [];
  for (var year = 1; year <= years; year++) {
    var askContribYear = 0;
    var freeContribYear = 0;
    for (var m = 0; m < 12; m++) {
      if (askValue < loft) {
        var room = loft - askValue;
        var deposit = Math.min(monthlyContrib, room);
        askValue = askValue * (1 + mr) + deposit;
        askContribYear += deposit;
        var overflow = monthlyContrib - deposit;
        if (overflow > 0) {
          freeValue = freeValue * (1 + mr) + overflow;
          freeContribYear += overflow;
        }
      } else {
        askValue = askValue * (1 + mr);
        freeValue = freeValue * (1 + mr) + monthlyContrib;
        freeContribYear += monthlyContrib;
        if (loftHitYear === null) loftHitYear = year;
      }
    }
    askTotalIn += askContribYear;
    freeTotalIn += freeContribYear;
    var askGain = askValue - askYearStart - askContribYear;
    if (askGain > 0) askValue -= askGain * ASK_TAX;
    askYearStart = askValue;
    var freeGain = freeValue - freeYearStart - freeContribYear + freeCarryLoss;
    if (freeGain > 0) {
      freeCarryLoss = 0;
      freeValue -= Math.min(freeGain, FREE_TAX_THRESHOLD) * FREE_TAX_LOW + Math.max(0, freeGain - FREE_TAX_THRESHOLD) * FREE_TAX_HIGH;
    } else {
      freeCarryLoss = Math.abs(freeGain);
    }
    freeYearStart = freeValue;
    var totalValue = askValue + freeValue;
    var totalIn = askTotalIn + freeTotalIn;
    yearlyData.push({
      year: year,
      totalValue: Math.round(totalValue),
      askValue: Math.round(askValue),
      freeValue: Math.round(freeValue),
      contributions: Math.round(totalIn),
      gain: Math.round(totalValue - totalIn)
    });
  }
  return {
    data: yearlyData,
    loftHitYear: loftHitYear
  };
}
function CustomTooltip(_ref) {
  var active = _ref.active,
    payload = _ref.payload,
    label = _ref.label;
  if (!active || !payload || !payload.length) return null;
  var d = payload[0] && payload[0].payload;
  if (!d) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0a0e18",
      border: "1px solid #1e2535",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 12,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#94a3b8",
      marginBottom: 6,
      fontWeight: 700
    }
  }, "\xC5r ", label), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#3b82f6",
      marginBottom: 2
    }
  }, "ASK: ", /*#__PURE__*/React.createElement("strong", null, formatDKK(d.askValue))), d.freeValue > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#a78bfa",
      marginBottom: 2
    }
  }, "Frie midler: ", /*#__PURE__*/React.createElement("strong", null, formatDKK(d.freeValue))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#22c55e"
    }
  }, "Total: ", /*#__PURE__*/React.createElement("strong", null, formatDKK(d.totalValue))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#334155",
      marginTop: 4,
      borderTop: "1px solid #1e2535",
      paddingTop: 4
    }
  }, "Indskudt: ", formatDKK(d.contributions)));
}
function App() {
  var _useState = useState(50000),
    _useState2 = _slicedToArray(_useState, 2),
    startAmount = _useState2[0],
    setStartAmount = _useState2[1];
  var _useState3 = useState(5000),
    _useState4 = _slicedToArray(_useState3, 2),
    monthly = _useState4[0],
    setMonthly = _useState4[1];
  var _useState5 = useState(8),
    _useState6 = _slicedToArray(_useState5, 2),
    annualReturn = _useState6[0],
    setAnnualReturn = _useState6[1];
  var _useState7 = useState("500k"),
    _useState8 = _slicedToArray(_useState7, 2),
    loftMode = _useState8[0],
    setLoftMode = _useState8[1];
  var loft = loftMode === "500k" ? 500000 : 174200;
  var _useMemo = useMemo(function () {
      return simulate(startAmount, monthly, annualReturn / 100, 20, loft);
    }, [startAmount, monthly, annualReturn, loft]),
    data = _useMemo.data,
    loftHitYear = _useMemo.loftHitYear;
  var summaries = HORIZONS.map(function (h) {
    return _objectSpread({
      years: h
    }, data[h - 1]);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "linear-gradient(160deg,#070b12 0%,#0d1422 60%,#070b12 100%)",
      padding: "max(env(safe-area-inset-top),20px) 16px 40px",
      fontFamily: "'DM Sans',sans-serif",
      color: "#e2e8f0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "MSCI World ETF \xB7 Aktiesparekonto"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: "#f1f5f9",
      marginBottom: 4
    }
  }, "Investeringsberegner"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#475569",
      fontSize: 12
    }
  }, "ASK 17% \xB7 Frie midler 27/42% lagerbeskatning")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 14,
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#64748b"
    }
  }, "ASK-loft:"), [["174k", "174.200 kr.", "Nuværende"], ["500k", "500.000 kr.", "Nyt forslag ✨"]].map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 3),
      k = _ref3[0],
      lbl = _ref3[1],
      sub = _ref3[2];
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setLoftMode(k);
      },
      style: {
        background: loftMode === k ? "linear-gradient(135deg,#1d4ed8,#0891b2)" : "rgba(255,255,255,0.04)",
        border: loftMode === k ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "7px 12px",
        cursor: "pointer",
        color: loftMode === k ? "#fff" : "#64748b",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4
      }
    }, lbl, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        opacity: 0.75
      }
    }, sub));
  })), loftHitYear ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(167,139,250,0.07)",
      border: "1px solid rgba(167,139,250,0.22)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 14,
      fontSize: 12,
      color: "#a78bfa",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("span", null, "ASK-loftet n\xE5s i ", /*#__PURE__*/React.createElement("strong", null, "\xE5r ", loftHitYear), ". Herefter g\xE5r indskud til frie midler (27/42% skat).")) : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(34,197,94,0.06)",
      border: "1px solid rgba(34,197,94,0.18)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 14,
      fontSize: 12,
      color: "#4ade80",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2705"), /*#__PURE__*/React.createElement("span", null, "Alle indskud inden for ASK-loftet i hele 20 \xE5r. Kun 17% skat.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      padding: "16px",
      marginBottom: 14,
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, [{
    label: "Startbeløb",
    value: startAmount,
    setter: setStartAmount,
    min: 0,
    max: 500000,
    step: 5000,
    fmt: function fmt(v) {
      return v.toLocaleString("da-DK") + " kr.";
    }
  }, {
    label: "Månedlig investering",
    value: monthly,
    setter: setMonthly,
    min: 0,
    max: 20000,
    step: 500,
    fmt: function fmt(v) {
      return v.toLocaleString("da-DK") + " kr.";
    }
  }, {
    label: "Forventet afkast p.a.",
    value: annualReturn,
    setter: setAnnualReturn,
    min: 3,
    max: 15,
    step: 0.5,
    fmt: function fmt(v) {
      return v + "%";
    }
  }].map(function (_ref4) {
    var label = _ref4.label,
      value = _ref4.value,
      setter = _ref4.setter,
      min = _ref4.min,
      max = _ref4.max,
      step = _ref4.step,
      fmt = _ref4.fmt;
    return /*#__PURE__*/React.createElement("div", {
      key: label
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "#475569",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'DM Mono',monospace",
        fontSize: 16,
        fontWeight: 600,
        color: "#38bdf8"
      }
    }, fmt(value))), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: min,
      max: max,
      step: step,
      value: value,
      onChange: function onChange(e) {
        return setter(Number(e.target.value));
      },
      style: {
        width: "100%",
        accentColor: "#3b82f6"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: "#334155",
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", null, fmt(min)), /*#__PURE__*/React.createElement("span", null, fmt(max))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8,
      marginBottom: 14
    }
  }, summaries.map(function (_ref5) {
    var years = _ref5.years,
      totalValue = _ref5.totalValue,
      contributions = _ref5.contributions,
      gain = _ref5.gain,
      freeValue = _ref5.freeValue;
    return /*#__PURE__*/React.createElement("div", {
      key: years,
      style: {
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: 12,
        padding: "12px 8px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg,#3b82f6,#06b6d4)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#475569",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 5
      }
    }, years, " \xE5r"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'DM Mono',monospace",
        fontSize: 12,
        fontWeight: 600,
        color: "#f1f5f9",
        marginBottom: 4
      }
    }, formatDKK(totalValue)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#22c55e",
        fontWeight: 600
      }
    }, "+", formatDKK(gain)), freeValue > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#a78bfa",
        marginTop: 2
      }
    }, "heraf fri: ", formatDKK(freeValue)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.018)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 14,
      padding: "16px 4px 10px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#475569",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 14
    }
  }, "Formueudvikling 20 \xE5r"), /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 200
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: data,
    margin: {
      top: 5,
      right: 8,
      left: 0,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "gA",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#3b82f6",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#3b82f6",
    stopOpacity: 0
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "gF",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#a78bfa",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#a78bfa",
    stopOpacity: 0
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "gC",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#475569",
    stopOpacity: 0.25
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#475569",
    stopOpacity: 0
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: "rgba(255,255,255,0.04)"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "year",
    tick: {
      fill: "#334155",
      fontSize: 10
    },
    tickFormatter: function tickFormatter(v) {
      return "".concat(v, "\xE5");
    },
    axisLine: false,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    tick: {
      fill: "#334155",
      fontSize: 9
    },
    tickFormatter: formatDKKShort,
    axisLine: false,
    tickLine: false,
    width: 40
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomTooltip, null)
  }), loftHitYear && /*#__PURE__*/React.createElement(ReferenceLine, {
    x: loftHitYear,
    stroke: "#a78bfa",
    strokeDasharray: "4 3",
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "contributions",
    stroke: "#475569",
    strokeWidth: 1,
    fill: "url(#gC)"
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "askValue",
    stroke: "#3b82f6",
    strokeWidth: 2,
    fill: "url(#gA)",
    stackId: "s"
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "freeValue",
    stroke: "#a78bfa",
    strokeWidth: 2,
    fill: "url(#gF)",
    stackId: "s"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 12,
      marginTop: 8
    }
  }, [["#3b82f6", "ASK (17%)"], ["#a78bfa", "Frie midler"], ["#475569", "Indskudt"]].map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      c = _ref7[0],
      l = _ref7[1];
    return /*#__PURE__*/React.createElement("span", {
      key: l,
      style: {
        color: "#475569",
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: c,
        display: "inline-block"
      }
    }), l);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 10,
      color: "#1e293b",
      padding: "0 8px"
    }
  }, "Vejledende. Lagerbeskatning tr\xE6kkes hvert \xE5r. MSCI World historisk ~8\u201310% p.a."));
}
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
