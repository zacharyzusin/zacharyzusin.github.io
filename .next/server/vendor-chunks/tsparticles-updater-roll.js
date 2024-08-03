"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/tsparticles-updater-roll";
exports.ids = ["vendor-chunks/tsparticles-updater-roll"];
exports.modules = {

/***/ "(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/Roll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/tsparticles-updater-roll/esm/Options/Classes/Roll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Roll: () => (/* binding */ Roll)\n/* harmony export */ });\n/* harmony import */ var tsparticles_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tsparticles-engine */ \"(ssr)/./node_modules/tsparticles-engine/esm/Options/Classes/OptionsColor.js\");\n/* harmony import */ var tsparticles_engine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tsparticles-engine */ \"(ssr)/./node_modules/tsparticles-engine/esm/Utils/NumberUtils.js\");\n/* harmony import */ var _RollLight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RollLight */ \"(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/RollLight.js\");\n\n\nclass Roll {\n    constructor() {\n        this.darken = new _RollLight__WEBPACK_IMPORTED_MODULE_0__.RollLight();\n        this.enable = false;\n        this.enlighten = new _RollLight__WEBPACK_IMPORTED_MODULE_0__.RollLight();\n        this.mode = \"vertical\";\n        this.speed = 25;\n    }\n    load(data) {\n        if (!data) {\n            return;\n        }\n        if (data.backColor !== undefined) {\n            this.backColor = tsparticles_engine__WEBPACK_IMPORTED_MODULE_1__.OptionsColor.create(this.backColor, data.backColor);\n        }\n        this.darken.load(data.darken);\n        if (data.enable !== undefined) {\n            this.enable = data.enable;\n        }\n        this.enlighten.load(data.enlighten);\n        if (data.mode !== undefined) {\n            this.mode = data.mode;\n        }\n        if (data.speed !== undefined) {\n            this.speed = (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_2__.setRangeValue)(data.speed);\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9PcHRpb25zL0NsYXNzZXMvUm9sbC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQWtFO0FBQzFCO0FBQ2pDO0FBQ1A7QUFDQSwwQkFBMEIsaURBQVM7QUFDbkM7QUFDQSw2QkFBNkIsaURBQVM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qiw0REFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixpRUFBYTtBQUN0QztBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9PcHRpb25zL0NsYXNzZXMvUm9sbC5qcz9mYTE4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wdGlvbnNDb2xvciwgc2V0UmFuZ2VWYWx1ZSwgfSBmcm9tIFwidHNwYXJ0aWNsZXMtZW5naW5lXCI7XG5pbXBvcnQgeyBSb2xsTGlnaHQgfSBmcm9tIFwiLi9Sb2xsTGlnaHRcIjtcbmV4cG9ydCBjbGFzcyBSb2xsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXJrZW4gPSBuZXcgUm9sbExpZ2h0KCk7XG4gICAgICAgIHRoaXMuZW5hYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5saWdodGVuID0gbmV3IFJvbGxMaWdodCgpO1xuICAgICAgICB0aGlzLm1vZGUgPSBcInZlcnRpY2FsXCI7XG4gICAgICAgIHRoaXMuc3BlZWQgPSAyNTtcbiAgICB9XG4gICAgbG9hZChkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJhY2tDb2xvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tDb2xvciA9IE9wdGlvbnNDb2xvci5jcmVhdGUodGhpcy5iYWNrQ29sb3IsIGRhdGEuYmFja0NvbG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhcmtlbi5sb2FkKGRhdGEuZGFya2VuKTtcbiAgICAgICAgaWYgKGRhdGEuZW5hYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlID0gZGF0YS5lbmFibGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmxpZ2h0ZW4ubG9hZChkYXRhLmVubGlnaHRlbik7XG4gICAgICAgIGlmIChkYXRhLm1vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gZGF0YS5tb2RlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnNwZWVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBzZXRSYW5nZVZhbHVlKGRhdGEuc3BlZWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/Roll.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/RollLight.js":
/*!********************************************************************************!*\
  !*** ./node_modules/tsparticles-updater-roll/esm/Options/Classes/RollLight.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RollLight: () => (/* binding */ RollLight)\n/* harmony export */ });\n/* harmony import */ var tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tsparticles-engine */ \"(ssr)/./node_modules/tsparticles-engine/esm/Utils/NumberUtils.js\");\n\nclass RollLight {\n    constructor() {\n        this.enable = false;\n        this.value = 0;\n    }\n    load(data) {\n        if (!data) {\n            return;\n        }\n        if (data.enable !== undefined) {\n            this.enable = data.enable;\n        }\n        if (data.value !== undefined) {\n            this.value = (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.setRangeValue)(data.value);\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9PcHRpb25zL0NsYXNzZXMvUm9sbExpZ2h0LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQW1EO0FBQzVDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGlFQUFhO0FBQ3RDO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy90c3BhcnRpY2xlcy11cGRhdGVyLXJvbGwvZXNtL09wdGlvbnMvQ2xhc3Nlcy9Sb2xsTGlnaHQuanM/M2Y2ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXRSYW5nZVZhbHVlIH0gZnJvbSBcInRzcGFydGljbGVzLWVuZ2luZVwiO1xuZXhwb3J0IGNsYXNzIFJvbGxMaWdodCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmFsdWUgPSAwO1xuICAgIH1cbiAgICBsb2FkKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuZW5hYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlID0gZGF0YS5lbmFibGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHNldFJhbmdlVmFsdWUoZGF0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/RollLight.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/tsparticles-updater-roll/esm/RollUpdater.js":
/*!******************************************************************!*\
  !*** ./node_modules/tsparticles-updater-roll/esm/RollUpdater.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RollUpdater: () => (/* binding */ RollUpdater)\n/* harmony export */ });\n/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ \"(ssr)/./node_modules/tsparticles-updater-roll/esm/Utils.js\");\n/* harmony import */ var _Options_Classes_Roll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Options/Classes/Roll */ \"(ssr)/./node_modules/tsparticles-updater-roll/esm/Options/Classes/Roll.js\");\n\n\nclass RollUpdater {\n    getTransformValues(particle) {\n        const roll = particle.roll?.enable && particle.roll, rollHorizontal = roll && roll.horizontal, rollVertical = roll && roll.vertical;\n        return {\n            a: rollHorizontal ? Math.cos(roll.angle) : undefined,\n            d: rollVertical ? Math.sin(roll.angle) : undefined,\n        };\n    }\n    init(particle) {\n        (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.initParticle)(particle);\n    }\n    isEnabled(particle) {\n        const roll = particle.options.roll;\n        return !particle.destroyed && !particle.spawning && !!roll?.enable;\n    }\n    loadOptions(options, ...sources) {\n        if (!options.roll) {\n            options.roll = new _Options_Classes_Roll__WEBPACK_IMPORTED_MODULE_1__.Roll();\n        }\n        for (const source of sources) {\n            options.roll.load(source?.roll);\n        }\n    }\n    update(particle, delta) {\n        if (!this.isEnabled(particle)) {\n            return;\n        }\n        (0,_Utils__WEBPACK_IMPORTED_MODULE_0__.updateRoll)(particle, delta);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9Sb2xsVXBkYXRlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBbUQ7QUFDTDtBQUN2QztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9EQUFZO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHVEQUFJO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsa0RBQVU7QUFDbEI7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy90c3BhcnRpY2xlcy11cGRhdGVyLXJvbGwvZXNtL1JvbGxVcGRhdGVyLmpzPzU1ZGIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdFBhcnRpY2xlLCB1cGRhdGVSb2xsIH0gZnJvbSBcIi4vVXRpbHNcIjtcbmltcG9ydCB7IFJvbGwgfSBmcm9tIFwiLi9PcHRpb25zL0NsYXNzZXMvUm9sbFwiO1xuZXhwb3J0IGNsYXNzIFJvbGxVcGRhdGVyIHtcbiAgICBnZXRUcmFuc2Zvcm1WYWx1ZXMocGFydGljbGUpIHtcbiAgICAgICAgY29uc3Qgcm9sbCA9IHBhcnRpY2xlLnJvbGw/LmVuYWJsZSAmJiBwYXJ0aWNsZS5yb2xsLCByb2xsSG9yaXpvbnRhbCA9IHJvbGwgJiYgcm9sbC5ob3Jpem9udGFsLCByb2xsVmVydGljYWwgPSByb2xsICYmIHJvbGwudmVydGljYWw7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhOiByb2xsSG9yaXpvbnRhbCA/IE1hdGguY29zKHJvbGwuYW5nbGUpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZDogcm9sbFZlcnRpY2FsID8gTWF0aC5zaW4ocm9sbC5hbmdsZSkgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGluaXQocGFydGljbGUpIHtcbiAgICAgICAgaW5pdFBhcnRpY2xlKHBhcnRpY2xlKTtcbiAgICB9XG4gICAgaXNFbmFibGVkKHBhcnRpY2xlKSB7XG4gICAgICAgIGNvbnN0IHJvbGwgPSBwYXJ0aWNsZS5vcHRpb25zLnJvbGw7XG4gICAgICAgIHJldHVybiAhcGFydGljbGUuZGVzdHJveWVkICYmICFwYXJ0aWNsZS5zcGF3bmluZyAmJiAhIXJvbGw/LmVuYWJsZTtcbiAgICB9XG4gICAgbG9hZE9wdGlvbnMob3B0aW9ucywgLi4uc291cmNlcykge1xuICAgICAgICBpZiAoIW9wdGlvbnMucm9sbCkge1xuICAgICAgICAgICAgb3B0aW9ucy5yb2xsID0gbmV3IFJvbGwoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJvbGwubG9hZChzb3VyY2U/LnJvbGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZShwYXJ0aWNsZSwgZGVsdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZChwYXJ0aWNsZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVSb2xsKHBhcnRpY2xlLCBkZWx0YSk7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/tsparticles-updater-roll/esm/RollUpdater.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/tsparticles-updater-roll/esm/Utils.js":
/*!************************************************************!*\
  !*** ./node_modules/tsparticles-updater-roll/esm/Utils.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initParticle: () => (/* binding */ initParticle),\n/* harmony export */   updateRoll: () => (/* binding */ updateRoll)\n/* harmony export */ });\n/* harmony import */ var tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tsparticles-engine */ \"(ssr)/./node_modules/tsparticles-engine/esm/Utils/NumberUtils.js\");\n/* harmony import */ var tsparticles_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tsparticles-engine */ \"(ssr)/./node_modules/tsparticles-engine/esm/Utils/ColorUtils.js\");\n\nfunction initParticle(particle) {\n    const rollOpt = particle.options.roll;\n    if (!rollOpt?.enable) {\n        particle.roll = {\n            enable: false,\n            horizontal: false,\n            vertical: false,\n            angle: 0,\n            speed: 0,\n        };\n        return;\n    }\n    particle.roll = {\n        enable: rollOpt.enable,\n        horizontal: rollOpt.mode === \"horizontal\" || rollOpt.mode === \"both\",\n        vertical: rollOpt.mode === \"vertical\" || rollOpt.mode === \"both\",\n        angle: (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() * Math.PI * 2,\n        speed: (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.speed) / 360,\n    };\n    if (rollOpt.backColor) {\n        particle.backColor = (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_1__.rangeColorToHsl)(rollOpt.backColor);\n    }\n    else if (rollOpt.darken.enable && rollOpt.enlighten.enable) {\n        const alterType = (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRandom)() >= 0.5 ? \"darken\" : \"enlighten\";\n        particle.roll.alter = {\n            type: alterType,\n            value: (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(alterType === \"darken\" ? rollOpt.darken.value : rollOpt.enlighten.value),\n        };\n    }\n    else if (rollOpt.darken.enable) {\n        particle.roll.alter = {\n            type: \"darken\",\n            value: (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.darken.value),\n        };\n    }\n    else if (rollOpt.enlighten.enable) {\n        particle.roll.alter = {\n            type: \"enlighten\",\n            value: (0,tsparticles_engine__WEBPACK_IMPORTED_MODULE_0__.getRangeValue)(rollOpt.enlighten.value),\n        };\n    }\n}\nfunction updateRoll(particle, delta) {\n    const roll = particle.options.roll, data = particle.roll;\n    if (!data || !roll?.enable) {\n        return;\n    }\n    const speed = data.speed * delta.factor, max = 2 * Math.PI;\n    data.angle += speed;\n    if (data.angle > max) {\n        data.angle -= max;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9VdGlscy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQStFO0FBQ3hFO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSw2REFBUztBQUN4QixlQUFlLGlFQUFhO0FBQzVCO0FBQ0E7QUFDQSw2QkFBNkIsbUVBQWU7QUFDNUM7QUFDQTtBQUNBLDBCQUEwQiw2REFBUztBQUNuQztBQUNBO0FBQ0EsbUJBQW1CLGlFQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUVBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixpRUFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3RzcGFydGljbGVzLXVwZGF0ZXItcm9sbC9lc20vVXRpbHMuanM/ZjUxYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRSYW5kb20sIGdldFJhbmdlVmFsdWUsIHJhbmdlQ29sb3JUb0hzbCB9IGZyb20gXCJ0c3BhcnRpY2xlcy1lbmdpbmVcIjtcbmV4cG9ydCBmdW5jdGlvbiBpbml0UGFydGljbGUocGFydGljbGUpIHtcbiAgICBjb25zdCByb2xsT3B0ID0gcGFydGljbGUub3B0aW9ucy5yb2xsO1xuICAgIGlmICghcm9sbE9wdD8uZW5hYmxlKSB7XG4gICAgICAgIHBhcnRpY2xlLnJvbGwgPSB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogZmFsc2UsXG4gICAgICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgICAgICBhbmdsZTogMCxcbiAgICAgICAgICAgIHNwZWVkOiAwLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHBhcnRpY2xlLnJvbGwgPSB7XG4gICAgICAgIGVuYWJsZTogcm9sbE9wdC5lbmFibGUsXG4gICAgICAgIGhvcml6b250YWw6IHJvbGxPcHQubW9kZSA9PT0gXCJob3Jpem9udGFsXCIgfHwgcm9sbE9wdC5tb2RlID09PSBcImJvdGhcIixcbiAgICAgICAgdmVydGljYWw6IHJvbGxPcHQubW9kZSA9PT0gXCJ2ZXJ0aWNhbFwiIHx8IHJvbGxPcHQubW9kZSA9PT0gXCJib3RoXCIsXG4gICAgICAgIGFuZ2xlOiBnZXRSYW5kb20oKSAqIE1hdGguUEkgKiAyLFxuICAgICAgICBzcGVlZDogZ2V0UmFuZ2VWYWx1ZShyb2xsT3B0LnNwZWVkKSAvIDM2MCxcbiAgICB9O1xuICAgIGlmIChyb2xsT3B0LmJhY2tDb2xvcikge1xuICAgICAgICBwYXJ0aWNsZS5iYWNrQ29sb3IgPSByYW5nZUNvbG9yVG9Ic2wocm9sbE9wdC5iYWNrQ29sb3IpO1xuICAgIH1cbiAgICBlbHNlIGlmIChyb2xsT3B0LmRhcmtlbi5lbmFibGUgJiYgcm9sbE9wdC5lbmxpZ2h0ZW4uZW5hYmxlKSB7XG4gICAgICAgIGNvbnN0IGFsdGVyVHlwZSA9IGdldFJhbmRvbSgpID49IDAuNSA/IFwiZGFya2VuXCIgOiBcImVubGlnaHRlblwiO1xuICAgICAgICBwYXJ0aWNsZS5yb2xsLmFsdGVyID0ge1xuICAgICAgICAgICAgdHlwZTogYWx0ZXJUeXBlLFxuICAgICAgICAgICAgdmFsdWU6IGdldFJhbmdlVmFsdWUoYWx0ZXJUeXBlID09PSBcImRhcmtlblwiID8gcm9sbE9wdC5kYXJrZW4udmFsdWUgOiByb2xsT3B0LmVubGlnaHRlbi52YWx1ZSksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKHJvbGxPcHQuZGFya2VuLmVuYWJsZSkge1xuICAgICAgICBwYXJ0aWNsZS5yb2xsLmFsdGVyID0ge1xuICAgICAgICAgICAgdHlwZTogXCJkYXJrZW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBnZXRSYW5nZVZhbHVlKHJvbGxPcHQuZGFya2VuLnZhbHVlKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAocm9sbE9wdC5lbmxpZ2h0ZW4uZW5hYmxlKSB7XG4gICAgICAgIHBhcnRpY2xlLnJvbGwuYWx0ZXIgPSB7XG4gICAgICAgICAgICB0eXBlOiBcImVubGlnaHRlblwiLFxuICAgICAgICAgICAgdmFsdWU6IGdldFJhbmdlVmFsdWUocm9sbE9wdC5lbmxpZ2h0ZW4udmFsdWUpLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVSb2xsKHBhcnRpY2xlLCBkZWx0YSkge1xuICAgIGNvbnN0IHJvbGwgPSBwYXJ0aWNsZS5vcHRpb25zLnJvbGwsIGRhdGEgPSBwYXJ0aWNsZS5yb2xsO1xuICAgIGlmICghZGF0YSB8fCAhcm9sbD8uZW5hYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3BlZWQgPSBkYXRhLnNwZWVkICogZGVsdGEuZmFjdG9yLCBtYXggPSAyICogTWF0aC5QSTtcbiAgICBkYXRhLmFuZ2xlICs9IHNwZWVkO1xuICAgIGlmIChkYXRhLmFuZ2xlID4gbWF4KSB7XG4gICAgICAgIGRhdGEuYW5nbGUgLT0gbWF4O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/tsparticles-updater-roll/esm/Utils.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/tsparticles-updater-roll/esm/index.js":
/*!************************************************************!*\
  !*** ./node_modules/tsparticles-updater-roll/esm/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadRollUpdater: () => (/* binding */ loadRollUpdater)\n/* harmony export */ });\n/* harmony import */ var _RollUpdater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RollUpdater */ \"(ssr)/./node_modules/tsparticles-updater-roll/esm/RollUpdater.js\");\n\nasync function loadRollUpdater(engine, refresh = true) {\n    await engine.addParticleUpdater(\"roll\", () => new _RollUpdater__WEBPACK_IMPORTED_MODULE_0__.RollUpdater(), refresh);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHNwYXJ0aWNsZXMtdXBkYXRlci1yb2xsL2VzbS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUE0QztBQUNyQztBQUNQLHNEQUFzRCxxREFBVztBQUNqRSIsInNvdXJjZXMiOlsid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy90c3BhcnRpY2xlcy11cGRhdGVyLXJvbGwvZXNtL2luZGV4LmpzPzQ4MTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm9sbFVwZGF0ZXIgfSBmcm9tIFwiLi9Sb2xsVXBkYXRlclwiO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWRSb2xsVXBkYXRlcihlbmdpbmUsIHJlZnJlc2ggPSB0cnVlKSB7XG4gICAgYXdhaXQgZW5naW5lLmFkZFBhcnRpY2xlVXBkYXRlcihcInJvbGxcIiwgKCkgPT4gbmV3IFJvbGxVcGRhdGVyKCksIHJlZnJlc2gpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/tsparticles-updater-roll/esm/index.js\n");

/***/ })

};
;