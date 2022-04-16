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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Script_1 = __importDefault(require("./Script"));
function BasicOcean(prop) {
    var container = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var main = new Script_1.default(container.current);
        main.animate();
        return function () {
            main.destructor();
        };
    }, []);
    var dom = (0, jsx_runtime_1.jsx)("div", __assign({ ref: container }, { children: prop.children }));
    return dom;
}
exports.default = BasicOcean;
